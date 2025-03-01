import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "999999")
    const location = searchParams.get("location")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")

    const supabase = createServerSupabaseClient()

    let query = supabase
      .from("listings")
      .select(`
        *,
        seller:profiles!seller_id(
          username,
          full_name,
          avatar_url,
          bio,
          location
        ),
        category:categories!category_id(
          name,
          slug,
          parent:categories!parent_id(
            name,
            slug,
            parent:categories!parent_id(
              name,
              slug
            )
          )
        ),
        location:locations!listings_location_id_fkey(
          id,
          name,
          slug,
          parent_id,
          type
        )
      `, { count: 'exact' })
      .gte("price", minPrice)
      .lte("price", maxPrice)
      .order("created_at", { ascending: false })

    // Add date range filter if provided
    if (fromDate) {
      query = query.gte("created_at", fromDate)
    }
    if (toDate) {
      query = query.lte("created_at", toDate)
    }

    if (category) {
      try {
        // First try to find the category by slug
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("id, parent_id")
          .eq("slug", category)
          .single()

        if (categoryError) {
          console.error("Error finding category:", categoryError)
          throw new Error("Category not found")
        }

        if (categoryData) {
          // Get all categories to build the hierarchy
          const { data: allCategories, error: allCategoriesError } = await supabase
            .from("categories")
            .select("id, parent_id")

          if (allCategoriesError) {
            console.error("Error fetching all categories:", allCategoriesError)
            // Fallback to just the found category
            query = query.eq("category_id", categoryData.id)
          } else if (allCategories && allCategories.length > 0) {
            // Helper function to get all child category IDs recursively
            function getAllChildCategories(parentId: string): string[] {
              const children = allCategories.filter((cat) => cat.parent_id === parentId)
              const childIds = children.map((child) => child.id)
              const grandChildIds = children.flatMap((child) => getAllChildCategories(child.id))
              return [...childIds, ...grandChildIds]
            }

            // Get all category IDs including the main category and all its descendants
            const allCategoryIds = [categoryData.id, ...getAllChildCategories(categoryData.id)]
            query = query.in("category_id", allCategoryIds)
          } else {
            // Fallback to just the found category
            query = query.eq("category_id", categoryData.id)
          }
        }
      } catch (err) {
        console.error("Error in category filtering:", err)
        // If there's an error with category filtering, continue without it
        console.warn("Continuing without category filter")
      }
    }

    if (location) {
      const locationIds = location.split(',')
      query = query.in("location_id", locationIds)
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: listings, error: listingsError, count } = await query.range(from, to)

    if (listingsError) {
      console.error("Error fetching listings:", listingsError)
      throw listingsError
    }

    if (!listings) {
      return NextResponse.json({
        listings: [],
        total: 0,
        page,
        totalPages: 0
      })
    }

    // Get reviews for each listing
    const listingsWithReviews = await Promise.all(
      listings.map(async (listing) => {
        try {
          const { data: reviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("listing_id", listing.id)

          const rating = reviews?.length 
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length 
            : 0

          return {
            ...listing,
            rating,
            total_reviews: reviews?.length || 0,
          }
        } catch (err) {
          console.error(`Error fetching reviews for listing ${listing.id}:`, err)
          return {
            ...listing,
            rating: 0,
            total_reviews: 0,
          }
        }
      }),
    )

    return NextResponse.json({
      listings: listingsWithReviews,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("Error in listings API:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Error fetching listings",
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the current user
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession()
    if (authError || !session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const data = await request.json()

    // Create listing with the current user as seller
    const { error } = await supabase.from("listings").insert({
      ...data,
      seller_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return new Response("Listing created successfully", { status: 201 })
  } catch (error) {
    console.error("Error creating listing:", error)
    return new Response("Error creating listing", { status: 500 })
  }
}


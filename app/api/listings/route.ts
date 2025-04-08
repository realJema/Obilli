import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

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
    const minRating = searchParams.get("minRating")
    const sort = searchParams.get("sort") || "newest"

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
        location:locations2!listings_location_id_fkey(
          id,
          name,
          slug,
          parent_id,
          type
        )
      `, { count: 'exact' })
      .gte("price", minPrice)
      .lte("price", maxPrice)

    // Get parent locations in a separate query
    const getParentLocation = async (parentId: string) => {
      const { data } = await supabase
        .from('locations2')
        .select('id, name, slug, type')
        .eq('id', parentId)
        .single()
      return data
    }

    // Apply sorting
    if (sort === "newest") {
      query = query.order("created_at", { ascending: false })
    } else if (sort === "oldest") {
      query = query.order("created_at", { ascending: true })
    } else if (sort === "price-low") {
      query = query.order("price", { ascending: true })
    } else if (sort === "price-high") {
      query = query.order("price", { ascending: false })
    } else {
      // Default to newest
      query = query.order("created_at", { ascending: false })
    }

    // Add date range filter if provided
    if (fromDate) {
      query = query.gte("created_at", fromDate)
    }
    if (toDate) {
      // Add one day to include the entire day
      const toDateObj = new Date(toDate)
      toDateObj.setDate(toDateObj.getDate() + 1)
      const nextDay = toDateObj.toISOString().split('T')[0]
      query = query.lt("created_at", nextDay)
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
              const children = allCategories!.filter((cat) => cat.parent_id === parentId)
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
      try {
        const locationIds = location.split(',')
        
        // Get all selected locations with their details
        const { data: selectedLocations, error: locationsError } = await supabase
          .from('locations2')
          .select('id, type, parent_id')
          .in('id', locationIds)

        if (locationsError) {
          console.error("Error fetching selected locations:", locationsError)
          throw locationsError
        }

        if (selectedLocations && selectedLocations.length > 0) {
          // Get all locations to find quarters for towns
          const { data: allLocations, error: allLocationsError } = await supabase
            .from('locations2')
            .select('id, parent_id, type')

          if (allLocationsError) {
            console.error("Error fetching all locations:", allLocationsError)
            // Fallback to just the selected locations
            query = query.in("location_id", locationIds)
          } else {
            // Helper function to get all quarter IDs for a town
            function getQuarterIds(townId: string): string[] {
              return allLocations
                ?.filter(loc => loc.parent_id === townId && loc.type === 'quarter')
                .map(loc => loc.id) || []
            }

            // Build final location IDs array including quarters for towns
            const finalLocationIds = selectedLocations.flatMap(loc => {
              if (loc.type === 'town') {
                // If it's a town, include the town ID and all its quarters
                return [loc.id, ...getQuarterIds(loc.id)]
              }
              // If it's a quarter, just include the quarter ID
              return [loc.id]
            })

            query = query.in("location_id", finalLocationIds)
          }
        } else {
          // Fallback to original behavior if no locations found
          query = query.in("location_id", locationIds)
        }
      } catch (err) {
        console.error("Error in location filtering:", err)
        // If there's an error with location filtering, continue with original behavior
        query = query.in("location_id", location.split(','))
      }
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

    // Get parent locations for each listing
    const listingsWithParentLocations = await Promise.all(
      listings.map(async (listing) => {
        if (listing.location?.parent_id) {
          const parentLocation = await getParentLocation(listing.location.parent_id)
          return {
            ...listing,
            location: {
              ...listing.location,
              parent: parentLocation
            }
          }
        }
        return listing
      })
    )

    // Get reviews for each listing
    const listingsWithReviews = await Promise.all(
      listingsWithParentLocations.map(async (listing) => {
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

    // Filter by minimum rating if specified
    let filteredListings = listingsWithReviews
    if (minRating && minRating !== 'all') {
      const minRatingValue = parseFloat(minRating)
      filteredListings = listingsWithReviews.filter(listing => listing.rating >= minRatingValue)
    }

    // If sorting by rating, sort the filtered listings
    if (sort === "rating") {
      filteredListings.sort((a, b) => b.rating - a.rating)
    }

    return NextResponse.json({
      listings: filteredListings,
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


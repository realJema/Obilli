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
          slug
        )
      `)
      .gte("price", minPrice)
      .lte("price", maxPrice)
      .order("created_at", { ascending: false })

    if (category) {
      const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", category).single()

      if (categoryData) {
        query = query.eq("category_id", categoryData.id)
      }
    }

    if (location) {
      query = query.ilike("location", `%${location}%`)
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: listings, error, count } = await query.range(from, to)

    if (error) {
      throw error
    }

    // Get reviews for each listing
    const listingsWithReviews = await Promise.all(
      listings.map(async (listing) => {
        const { data: reviews } = await supabase.from("reviews").select("rating").eq("listing_id", listing.id)

        const rating = reviews?.length ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length : 0

        return {
          ...listing,
          rating,
          total_reviews: reviews?.length || 0,
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
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Error fetching listings" }, { status: 500 })
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

    const { error } = await supabase.from("listings").insert({
      ...data,
      seller_id: session.user.id,
    })

    if (error) throw error

    return new Response("Listing created successfully", { status: 201 })
  } catch (error) {
    console.error("Error creating listing:", error)
    return new Response("Error creating listing", { status: 500 })
  }
}


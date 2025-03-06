import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

const ITEMS_PER_PAGE = 15 // 3 rows × 5 columns

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const page = parseInt(searchParams.get("page") || "1")
    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    if (!query) {
      return NextResponse.json({ results: [], total: 0 })
    }

    // Use RouteHandler client instead of ServerComponent client
    const supabase = createRouteHandlerClient({ cookies })

    try {
      // Get total count for pagination
      const { count: total } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .ilike('title', `%${query}%`)

      // Get paginated results with related data
      const { data: results, error } = await supabase
        .from("listings")
        .select(`
          id,
          title,
          description,
          price,
          created_at,
          images,
          location_id,
          address,
          seller:profiles(
            username,
            full_name,
            avatar_url
          ),
          category:categories(
            id,
            name,
            slug
          ),
          reviews:reviews(
            rating
          )
        `)
        .ilike('title', `%${query}%`)
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) throw error

      // Calculate rating and total_reviews from the reviews array
      const processedResults = results?.map(listing => {
        const reviews = listing.reviews || []
        const total_reviews = reviews.length
        const rating = total_reviews > 0
          ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / total_reviews
          : 0

        // Remove the reviews array from the final result
        const { reviews: _, ...listingWithoutReviews } = listing
        
        return {
          ...listingWithoutReviews,
          total_reviews,
          rating
        }
      }) || []

      return NextResponse.json({ 
        results: processedResults,
        total,
        page,
        totalPages: Math.ceil((total || 0) / ITEMS_PER_PAGE)
      })

    } catch (dbError) {
      return NextResponse.json(
        { error: "Database operation failed", details: dbError },
        { status: 500 }
      )
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    )
  }
}


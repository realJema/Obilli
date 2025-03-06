import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    console.log("Search query:", query)

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    // Use RouteHandler client instead of ServerComponent client
    const supabase = createRouteHandlerClient({ cookies })

    try {
      // Simple global search across all listings with related data
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
        .limit(10)

      console.log("Search results:", results)

      if (error) {
        console.error("Database error:", error)
        throw error
      }

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

      return NextResponse.json({ results: processedResults })

    } catch (dbError) {
      console.error("Database operation failed:", dbError)
      return NextResponse.json(
        { error: "Database operation failed", details: dbError },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Request failed:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    )
  }
}


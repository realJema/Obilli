import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()

    const { data: listing, error } = await supabase
      .from("listings")
      .select(`
        *,
        seller:profiles!listings_seller_id_fkey(
          username,
          full_name,
          avatar_url,
          bio,
          location
        ),
        category:categories!listings_category_id_fkey(
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
          type,
          parent:locations2!locations2_parent_id_fkey(
            id,
            name,
            slug,
            type
          )
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    // Get reviews for the listing
    const { data: reviews } = await supabase
      .from("reviews")
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(
          username,
          full_name,
          avatar_url
        )
      `)
      .eq("listing_id", params.id)
      .order("created_at", { ascending: false })

    // Calculate average rating
    const rating = reviews?.length ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length : 0

    // Get similar listings from the same category
    const { data: similarListings } = await supabase
      .from("listings")
      .select(`
        *,
        seller:profiles!seller_id(
          username,
          full_name,
          avatar_url
        ),
        location:locations2!listings_location_id_fkey(
          id,
          name,
          slug,
          parent_id,
          type
        )
      `)
      .eq("category_id", listing.category_id)
      .neq("id", listing.id)
      .limit(5)

    return NextResponse.json({
      listing: {
        ...listing,
        rating,
        reviews,
        similar_listings: similarListings,
      },
    })
  } catch (error) {
    console.error("Error fetching listing:", error)
    return NextResponse.json({ error: "Error fetching listing" }, { status: 500 })
  }
}


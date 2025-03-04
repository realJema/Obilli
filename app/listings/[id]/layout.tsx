import { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { constructListingMetadata } from "@/lib/metadata"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: listing } = await supabase
    .from("listings")
    .select(`
      *,
      location:locations!listings_location_id_fkey(
        id,
        name,
        slug,
        parent:locations!locations_parent_id_fkey(
          id,
          name,
          slug
        )
      )
    `)
    .eq("id", params.id)
    .single()

  if (!listing) {
    return constructListingMetadata({
      title: "Listing Not Found",
      description: "The listing you're looking for doesn't exist or has been removed.",
      images: [],
      price: 0,
      condition: "",
      location: { name: "" }
    })
  }

  return constructListingMetadata({
    title: listing.title,
    description: listing.description,
    images: listing.images || [],
    price: listing.price,
    condition: listing.condition,
    location: listing.location
  })
}

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 

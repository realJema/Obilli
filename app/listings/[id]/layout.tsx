import { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { constructListingMetadata } from "@/lib/metadata"

// Default metadata while loading
const defaultMetadata: Metadata = {
  title: "Loading... | Obilli",
  description: "Loading listing details..."
}

export async function generateMetadata({ 
  params,
  searchParams = {} // Provide default empty object
}: { 
  params: { id: string }
  searchParams?: { [key: string]: string | string[] }
}): Promise<Metadata> {
  // First try to use search params if available
  const hasValidSearchParams = 
    typeof searchParams?.title === 'string' &&
    typeof searchParams?.description === 'string' &&
    typeof searchParams?.price === 'string';

  if (hasValidSearchParams) {
    try {
      const location = searchParams.location ? JSON.parse(String(searchParams.location)) : { name: "" }
      const images = searchParams.images ? JSON.parse(String(searchParams.images)) : []
      
      return constructListingMetadata({
        title: String(searchParams.title),
        description: String(searchParams.description),
        images: images,
        price: parseInt(String(searchParams.price)),
        condition: String(searchParams.condition || ""),
        location: location
      })
    } catch (error) {
      console.error('Error parsing search params:', error)
      // Return default metadata and continue with database fetch
      return defaultMetadata
    }
  }

  try {
    // Fetch from the database
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
      return {
        title: "Listing | Obilli",
        description: "The listing you're looking for doesn't exist or has been removed."
      }
    }

    return constructListingMetadata({
      title: listing.title,
      description: listing.description,
      images: listing.images || [],
      price: listing.price,
      condition: listing.condition,
      location: listing.location
    })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return defaultMetadata
  }
}

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 

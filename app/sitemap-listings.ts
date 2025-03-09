import { MetadataRoute } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the actual domain
  const baseUrl = "https://obilli.com"
  const supabase = createServerSupabaseClient()

  // Get listings with pagination - 1000 most recent listings
  // This can be further paginated if needed
  const { data: listings } = await supabase
    .from("listings")
    .select("id, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1000)

  // Dynamic listing pages with actual lastModified dates from the database
  return (listings || []).map((listing) => ({
    url: `${baseUrl}/listings/${listing.id}`,
    lastModified: new Date(listing.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))
} 

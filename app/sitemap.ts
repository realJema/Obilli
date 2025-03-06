import { createServerSupabaseClient } from "@/lib/supabase/server"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const supabase = createServerSupabaseClient()

  // Get all listings
  const { data: listings } = await supabase
    .from("listings")
    .select("id, updated_at")
    .eq("status", "active") // Only include active listings

  // Get all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")

  // Get all locations
  const { data: locations } = await supabase
    .from("locations")
    .select("slug, updated_at")

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]

  // Dynamic listing pages
  const listingPages = (listings || []).map((listing) => ({
    url: `${baseUrl}/listings/${listing.id}`,
    lastModified: new Date(listing.updated_at),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }))

  // Category pages
  const categoryPages = (categories || []).map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Location pages
  const locationPages = (locations || []).map((location) => ({
    url: `${baseUrl}/locations/${location.slug}`,
    lastModified: new Date(location.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...listingPages,
    ...categoryPages,
    ...locationPages,
  ]
} 

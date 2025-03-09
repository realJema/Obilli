import { MetadataRoute } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the actual domain
  const baseUrl = "https://obilli.com"
  const supabase = createServerSupabaseClient()

  // Get all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")

  // Get all locations
  const { data: locations } = await supabase
    .from("locations")
    .select("slug, updated_at")

  // Combine categories and locations
  const categoryPages = (categories || []).map((category) => ({
    url: `${baseUrl}/filter?category=${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const locationPages = (locations || []).map((location) => ({
    url: `${baseUrl}/filter?location=${location.slug}`,
    lastModified: new Date(location.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...categoryPages, ...locationPages]
} 

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { MetadataRoute } from "next"
import { headers } from "next/headers"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use the production URL for sitemap
  const baseUrl = "https://obilli.com"

  const supabase = createServerSupabaseClient()

  // Get all listings - limit to a reasonable number of recent listings
  const { data: listings } = await supabase
    .from("listings")
    .select("id, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100) // Limit to most recent 100 listings

  // Get all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")

  // Get all locations
  const { data: locations } = await supabase
    .from("locations")
    .select("slug, updated_at")
    
  // Get popular profiles (limit to avoid excessive entries)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, updated_at")
    .limit(50) // Limit to 50 most relevant profiles

  // Static pages - exclude auth pages and other non-indexable pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0, // Homepage gets highest priority
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/filter`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/listings/create`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ]

  // Dynamic listing pages - with appropriate priorities
  const listingPages = (listings || []).map((listing) => ({
    url: `${baseUrl}/listings/${listing.id}`,
    lastModified: new Date(listing.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7, // Individual listings get lower priority
  }))

  // Category pages - important for navigation
  const categoryPages = (categories || []).map((category) => ({
    url: `${baseUrl}/filter?category=${category.slug}`,
    lastModified: new Date(category.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8, // Categories are important for navigation
  }))

  // Location pages
  const locationPages = (locations || []).map((location) => ({
    url: `${baseUrl}/filter?location=${location.slug}`,
    lastModified: new Date(location.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))
  
  // Profile pages - only include public profiles
  const profilePages = (profiles || []).map((profile) => ({
    url: `${baseUrl}/profile/${profile.username}`,
    lastModified: new Date(profile.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6, // Lower priority for profile pages
  }))

  // Combine all pages
  return [
    ...staticPages,
    ...categoryPages, // Categories are more important than individual listings
    ...locationPages,
    ...listingPages,
    ...profilePages,
  ]
} 

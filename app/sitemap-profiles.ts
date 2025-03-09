import { MetadataRoute } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the actual domain
  const baseUrl = "https://obilli.com"
  const supabase = createServerSupabaseClient()
  
  // Get profiles with pagination
  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, updated_at")
    .limit(500) // Limit to 500 profiles

  // Profile pages with actual lastModified dates
  return (profiles || []).map((profile) => ({
    url: `${baseUrl}/profile/${profile.username}`,
    lastModified: new Date(profile.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))
} 

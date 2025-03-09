import { MetadataRoute } from "next"

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the actual domain
  const baseUrl = "https://obilli.com"
  
  // Static pages with accurate lastModified dates
  return Promise.resolve([
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
  ])
} 

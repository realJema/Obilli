import { MetadataRoute } from 'next'

// Next.js supports sitemap index files
export default function sitemapIndex(): MetadataRoute.Sitemap {
  // Use the actual domain
  const baseUrl = "https://obilli.com"
  
  return [
    {
      url: `${baseUrl}/sitemap-static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-listings.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-categories.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemap-profiles.xml`,
      lastModified: new Date(),
    },
  ]
} 

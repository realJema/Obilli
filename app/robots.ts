import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use the actual domain
  const baseUrl = "https://obilli.com"
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/settings',
          '/listings/create',
          '/listings/*/edit',
          '/listings/success',
          '/*?*', // Disallow URL parameters except for specific pages
        ]
      },
      {
        // Allow search and filter pages with parameters
        userAgent: '*',
        allow: [
          '/search?*',
          '/filter?*'
        ]
      }
    ],
    // Reference the sitemap index instead of a single sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
    // Self-reference the robots.txt URL
    host: baseUrl
  }
} 

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable Next.js image optimization in production to avoid 402 from Vercel limits
    // These images will be served directly from Supabase storage/CDN
    unoptimized: true,
    // Use single format to reduce transformations by ~50%
    formats: ['image/webp'],
    
    // Set cache TTL to 31 days to reduce repeated transformations
    minimumCacheTTL: 2678400, // 31 days in seconds
    
    // Optimize image sizes to reduce transformations (fewer sizes = fewer transformations)
    imageSizes: [32, 64, 128, 256],
    deviceSizes: [640, 1080, 1920],
    
    // Restrict remote patterns to only necessary domains
    remotePatterns: [
      // Supabase storage (primary)
      {
        protocol: 'https',
        hostname: 'pnngjdupnffohifftsqb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // Unsplash fallback images used in SSR cards
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

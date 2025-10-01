import { MainLayout } from "@/components/main-layout";
import { Star, MapPin, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { Suspense } from "react";
import { TrendingListingsClient } from "./trending-section";
import { CategoriesClient } from "./categories-section";
import { listingsRepo } from "@/lib/repositories";
import { HeroCarousel } from "@/components/hero-carousel";
import { AdBanner } from "@/components/ad-banner";

// Define a simplified type for homepage listings
interface HomepageListing {
  id: string;
  title: string;
  price_xaf: number | null;
  description: string | null;
  created_at: string | null;
  category?: {
    id: number;
    name_en: string;
    name_fr: string;
  };
  owner?: {
    id: string;
    username: string | null;
  };
  media?: {
    url: string;
  }[];
  location?: {
    id: number;
    location_en: string;
    location_fr: string;
  } | null;
}

// Server-side data fetching for critical content with background refresh
async function getServerSideData() {
  try {
    // Fetch initial data - this will return cached data immediately if available
    // and refresh in background if stale
    const [heroListings, featuredListings, categoryData] = await Promise.all([
      listingsRepo.getHeroListings(5),
      listingsRepo.getFeaturedListings(10),
      listingsRepo.getHomepageCategories(8)
    ]);
    
    // Extract category IDs for client-side optimization
    const categoryIds = categoryData.map(category => category.id);
    
    return { heroListings, featuredListings, categoryIds, categoryData };
  } catch (error) {
    console.error('Failed to fetch server-side data:', error);
    return { heroListings: [], featuredListings: [], categoryIds: [], categoryData: [] };
  }
}

// More granular suspense boundaries for better loading experience
function GranularSuspenseWrapper({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Loading skeleton for the hero carousel
function HeroCarouselSkeleton() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[400px] bg-gradient-to-r from-primary to-primary/80 animate-pulse rounded-2xl">
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-primary-foreground">
              <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Loading skeleton for horizontal sections
function HorizontalSectionSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="h-6 w-6 bg-primary mr-3 rounded animate-pulse"></div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-[3/2] bg-muted"></div>
            <div className="p-3">
              <div className="h-3 bg-muted rounded mb-1"></div>
              <div className="h-4 bg-muted rounded mb-2 w-2/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Category section skeleton
function CategoriesSkeleton() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Categories</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Main server component
export default async function HomePage() {
  const { heroListings, featuredListings, categoryIds, categoryData } = await getServerSideData();
  
  return (
    <MainLayout>
      {/* Hero Carousel - server-side data */}
      <GranularSuspenseWrapper fallback={<HeroCarouselSkeleton />}>
        <HeroCarousel listings={heroListings} />
      </GranularSuspenseWrapper>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Listings - server-side data */}
        <GranularSuspenseWrapper fallback={<HorizontalSectionSkeleton title="Featured Listings" />}>
          <FeaturedListingsServer listings={featuredListings} />
        </GranularSuspenseWrapper>
        
        {/* Ad Banner after featured listings - rectangular ads */}
        <AdBanner placement="rectangular-top" />
        
        {/* Client-side sections for non-critical data */}
        <GranularSuspenseWrapper fallback={<HorizontalSectionSkeleton title="Trending Now" />}>
          <TrendingListingsClient />
        </GranularSuspenseWrapper>
        
        {/* Ad Banner between trending and categories - rectangular ads */}
        <AdBanner placement="rectangular-middle" />
        
        <GranularSuspenseWrapper fallback={<CategoriesSkeleton />}>
          <CategoriesClient categoryIds={categoryIds} categoryData={categoryData} />
        </GranularSuspenseWrapper>
        
        {/* Ad Banner above footer - rectangular ads */}
        <AdBanner placement="rectangular-bottom" />
      </div>
    </MainLayout>
  );
}

// Server-side component for featured listings
function FeaturedListingsServer({ listings }: { listings: HomepageListing[] }) {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-foreground">Featured Listings</h2>
        </div>
        
        <Link
          href="/search"
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {listings.map((listing) => (
          <div key={listing.id} className="h-full">
            <ServerListingCard listing={listing} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Simplified listing card for server-side rendering
function ServerListingCard({ listing }: { listing: HomepageListing }) {
  // Relative time requires client i18n, so we only show it in client sections.
  // For SSR cards, omit the date to avoid hydration of relative timers.
  const imageUrl = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
    
  const locationDisplay = listing.location 
    ? (listing.location.location_fr || listing.location.location_en)
    : null;
    
  const priceDisplay = listing.price_xaf && listing.price_xaf > 0 
    ? `FCFA ${listing.price_xaf.toLocaleString()}`
    : "Negotiable";

  return (
    <Link href={`/listing/${listing.id}`} className="block group h-full">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-[3/2]">
          <DefaultImage
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors min-h-[2rem] text-sm">
            {listing.title}
          </h3>
          
          {listing.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {listing.description}
            </p>
          )}
          
          <div className="text-lg font-bold text-primary mb-2">
            {priceDisplay}
          </div>
          
          <div className="mt-auto space-y-1">
            {locationDisplay && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {locationDisplay}
              </div>
            )}
            {/* Relative time is shown in client sections (Trending/Categories). */}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Boosted ad card component for rectangular ads
function BoostedAdCard({ listing }: { listing: HomepageListing }) {
  const imageUrl = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
    
  const locationDisplay = listing.location 
    ? (listing.location.location_fr || listing.location.location_en)
    : null;
    
  const priceDisplay = listing.price_xaf && listing.price_xaf > 0 
    ? `FCFA ${listing.price_xaf.toLocaleString()}`
    : "Negotiable";

  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-[3/2]">
          <DefaultImage
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            AD
          </div>
        </div>
        
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors min-h-[2rem] text-sm">
            {listing.title}
          </h3>
          
          {listing.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {listing.description}
            </p>
          )}
          
          <div className="text-lg font-bold text-primary mb-2">
            {priceDisplay}
          </div>
          
          <div className="mt-auto space-y-1">
            {locationDisplay && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {locationDisplay}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

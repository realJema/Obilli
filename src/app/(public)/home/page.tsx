"use client";

import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { Search, TrendingUp, Star, Clock, MapPin, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { listingsRepo, categoriesRepo } from "@/lib/repositories";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import { hasActiveBoost, getActiveBoostTier } from "@/lib/repositories/listings";
import type { CategoryWithChildren } from "@/lib/repositories/categories";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

function HeroCarousel({ listings, isLoading }: { listings: ListingWithDetails[]; isLoading: boolean }) {
  const { formatCurrency } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (listings.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % listings.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [listings.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Reset auto-scroll timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % listings.length);
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <section className="relative h-[800px] bg-gradient-to-r from-primary to-primary/80 animate-pulse">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="relative h-[800px] bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl font-bold mb-4">Welcome to Bonas Marketplace</h1>
            <p className="text-xl opacity-90">Discover amazing deals in Cameroon</p>
          </div>
        </div>
      </section>
    );
  }

  const currentListing = listings[currentIndex];
  const imageUrl = currentListing.media && currentListing.media.length > 0 
    ? currentListing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1200&h=400&auto=format&fit=crop';

  return (
    <section className="relative h-[800px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <DefaultImage
          src={imageUrl}
          alt={currentListing.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div className="inline-block bg-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            Featured Listing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {currentListing.title}
          </h1>
          {currentListing.description && (
            <p className="text-xl mb-6 opacity-90 line-clamp-2">
              {currentListing.description}
            </p>
          )}
          {currentListing.price_xaf && (
            <div className="text-3xl font-bold text-yellow-400 mb-6">
              {formatCurrency(currentListing.price_xaf)}
            </div>
          )}
          <Link
            href={`/listing/${currentListing.id}`}
            className="inline-flex items-center bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Details
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {listings.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentIndex - 1 + listings.length) % listings.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => goToSlide((currentIndex + 1) % listings.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
}

function ListingCard({ listing }: { listing: ListingWithDetails }) {
  const { formatCurrency, formatRelativeTime } = useI18n();
  
  // Get the first media image or use default
  const imageUrl = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
  
  // Check if listing has active boost
  const isActivelyBoosted = hasActiveBoost(listing);
  const boostTier = getActiveBoostTier(listing);
  
  // Build location display from hierarchical data
  const getLocationDisplay = () => {
    if (!listing.location) return null;
    
    const parts = [];
    
    // Quarter name
    parts.push(listing.location.location_en);
    
    // City name
    if (listing.location.city) {
      parts.push(listing.location.city.location_en);
    }
    
    // Region name (only if we have city)
    if (listing.location.city?.region) {
      parts.push(`(${listing.location.city.region.location_en})`);
    }
    
    return parts.join(', ');
  };
  
  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-[4/3]">
          <DefaultImage
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Show featured badge only for actively boosted listings */}
          {isActivelyBoosted && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1" />
              {boostTier === 'top' ? 'Top' : boostTier === 'premium' ? 'Premium' : 'Featured'}
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {listing.title}
          </h3>
          
          {listing.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
              {listing.description}
            </p>
          )}
          
          {listing.price_xaf && (
            <div className="text-xl font-bold text-primary mb-2">
              {formatCurrency(listing.price_xaf)}
            </div>
          )}
          
          <div className="mt-auto space-y-2">
            {getLocationDisplay() && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {getLocationDisplay()}
              </div>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {formatRelativeTime(listing.created_at || new Date().toISOString())}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HorizontalScrollSection({ title, icon: Icon, listings, isLoading }: {
  title: string;
  icon: LucideIcon;
  listings: ListingWithDetails[];
  isLoading: boolean;
}) {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-muted"></div>
              <div className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          </div>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No listings found in this category yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link
            href="/search"
            className="ml-4 text-sm text-primary hover:text-primary/80 font-medium"
          >
            View all
          </Link>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {listings.map((listing) => (
            <div key={listing.id} className="flex-shrink-0 w-80">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySection({ category, listings, isLoading }: {
  category: CategoryWithChildren;
  listings: ListingWithDetails[];
  isLoading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">{category.name_en}</h2>
        </div>
        
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-muted"></div>
              <div className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">{category.name_en}</h2>
        </div>
        
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No listings in {category.name_en} yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">{category.name_en}</h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link
            href={`/search?category=${category.id}`}
            className="ml-4 text-sm text-primary hover:text-primary/80 font-medium"
          >
            View all
          </Link>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {listings.map((listing) => (
            <div key={listing.id} className="flex-shrink-0 w-80">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default function HomePage() {
  const [heroListings, setHeroListings] = useState<ListingWithDetails[]>([]);
  const [featuredListings, setFeaturedListings] = useState<ListingWithDetails[]>([]);
  const [recentListings, setRecentListings] = useState<ListingWithDetails[]>([]);
  const [trendingListings, setTrendingListings] = useState<ListingWithDetails[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [categoryListings, setCategoryListings] = useState<{ [key: number]: ListingWithDetails[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load top categories
        const topCategories = await categoriesRepo.getTopLevel();
        setCategories(topCategories.slice(0, 5)); // Top 5 categories
        
        // Load hero listings (top featured)
        const hero = await listingsRepo.getFeatured(5);
        setHeroListings(hero);
        
        // Load featured listings for horizontal scroll (actually featured)
        const featured = await listingsRepo.getFeatured(10);
        setFeaturedListings(featured);
        
        // Load recent listings
        const recent = await listingsRepo.getAll(
          {},
          { field: 'created_at', direction: 'desc' },
          10,
          0
        );
        setRecentListings(recent.data);
        
        // Load trending listings
        const trending = await listingsRepo.getAll(
          {},
          { field: 'created_at', direction: 'desc' },
          10,
          0
        );
        setTrendingListings(trending.data);
        
        // Load listings for each category
        const categoryListingsMap: { [key: number]: ListingWithDetails[] } = {};
        for (const category of topCategories.slice(0, 5)) {
          const { data } = await listingsRepo.getAll(
            { category_id: category.id },
            { field: 'created_at', direction: 'desc' },
            10,
            0
          );
          categoryListingsMap[category.id] = data;
        }
        setCategoryListings(categoryListingsMap);
        
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Listings</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Carousel - replacing the search section */}
      <HeroCarousel listings={heroListings} isLoading={isLoading} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Existing sections as horizontal scrollable rows */}
        <HorizontalScrollSection
          title="Featured Listings"
          icon={Star}
          listings={featuredListings}
          isLoading={isLoading}
        />
        
        <HorizontalScrollSection
          title="Trending Now"
          icon={TrendingUp}
          listings={trendingListings}
          isLoading={isLoading}
        />
        
        <HorizontalScrollSection
          title="Recently Added"
          icon={Clock}
          listings={recentListings}
          isLoading={isLoading}
        />
        
        {/* Category sections with 10 listings each */}
        {categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            listings={categoryListings[category.id] || []}
            isLoading={isLoading}
          />
        ))}
      </div>
    </MainLayout>
  );
}

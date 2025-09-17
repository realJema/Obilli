"use client";

import { useEffect, useState, useRef } from "react";
import { listingsRepo } from "@/lib/repositories";
import { TrendingUp, ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/providers";
import { useQuery } from '@tanstack/react-query';

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

// Simplified listing card component for trending section
function ListingCard({ listing }: { listing: HomepageListing }) {
  const { formatCurrency, formatRelativeTime, locale, t } = useI18n();
  
  // Get the first media image or use default
  const imageUrl = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
  
  // For homepage listings, we won't show boost badges since we don't fetch boost data
  const isActivelyBoosted = false;
  const boostTier = null;
  
  // Build location display from hierarchical data
  const getLocationDisplay = () => {
    if (!listing.location) return null;
    
    // Use the location name based on the current locale
    if (locale === 'fr' && listing.location.location_fr) {
      return listing.location.location_fr;
    }
    return listing.location.location_en;
  };
  
  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-[3/2]">
          <div className="absolute inset-0">
            {/* Using a simple img tag instead of DefaultImage for simplicity */}
            <img
              src={imageUrl}
              alt={listing.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
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
          
          {/* Show price or "Negotiable" if no price or price is 0 */}
          <div className="text-lg font-bold text-primary mb-2">
            {listing.price_xaf && listing.price_xaf > 0 
              ? formatCurrency(listing.price_xaf) 
              : t('listing.negotiable')}
          </div>
          
          <div className="mt-auto space-y-1">
            {getLocationDisplay() && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {getLocationDisplay()}
              </div>
            )}
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatRelativeTime(listing.created_at || new Date().toISOString())}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TrendingListingsClient() {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use React Query for caching
  const { data: trendingListings, isLoading, error } = useQuery({
    queryKey: ['trendingListings'],
    queryFn: () => listingsRepo.getTrendingListings(10),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

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
            <TrendingUp className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground">{t('home.trendingNow')}</h2>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 bg-card border border-border rounded-lg overflow-hidden animate-pulse">
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

  if (error) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground">{t('home.trendingNow')}</h2>
          </div>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{error instanceof Error ? error.message : 'Failed to load trending listings'}</p>
        </div>
      </section>
    );
  }

  if (!trendingListings || trendingListings.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-foreground">{t('home.trendingNow')}</h2>
          </div>
        </div>
        
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{t('home.noListingsFound')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-foreground">{t('home.trendingNow')}</h2>
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
            prefetch={true}
          >
            {t('common.viewAll')}
          </Link>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingListings.map((listing: HomepageListing) => (
            <div key={listing.id} className="flex-shrink-0 w-64">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
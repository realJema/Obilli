"use client";

import { useEffect, useState, useRef } from "react";
import { listingsRepo } from "@/lib/repositories";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/providers";
import { ListingCard } from "./listing-card";

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

export function TrendingListingsClient() {
  const [trendingListings, setTrendingListings] = useState<HomepageListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch trending listings
        const data = await listingsRepo.getTrendingListings(10);
        setTrendingListings(data);
      } catch (err) {
        console.error('Failed to load trending data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trending listings');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingData();
  }, []);

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
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (trendingListings.length === 0) {
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
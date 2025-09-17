"use client";

import { useEffect, useState, useRef } from "react";
import { listingsRepo } from "@/lib/repositories";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

interface HomepageCategory {
  id: number;
  name_en: string;
  name_fr: string;
  slug: string;
  listings: HomepageListing[];
}

interface CategoriesClientProps {
  categoryIds?: number[];
  categoryData?: HomepageCategory[];
}

export function CategoriesClient({ categoryIds = [], categoryData = [] }: CategoriesClientProps) {
  const [categories, setCategories] = useState<HomepageCategory[]>(categoryData);
  const [isLoading, setIsLoading] = useState(categoryData.length === 0);
  const [error, setError] = useState<string | null>(null);
  const { locale, t } = useI18n();
  const scrollRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  useEffect(() => {
    // If we already have category data from server-side, no need to fetch again
    if (categoryData.length > 0) {
      return;
    }

    const loadCategoriesData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch homepage categories
        const data = await listingsRepo.getHomepageCategories(8);
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoriesData();
  }, [categoryData]);

  const setScrollRef = (categoryId: number, element: HTMLDivElement | null) => {
    scrollRefs.current[categoryId] = element;
  };

  const scrollLeft = (categoryId: number) => {
    const scrollRef = scrollRefs.current[categoryId];
    if (scrollRef) {
      scrollRef.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = (categoryId: number) => {
    const scrollRef = scrollRefs.current[categoryId];
    if (scrollRef) {
      scrollRef.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Get the category name based on the current locale
  const getCategoryName = (category: HomepageCategory) => {
    if (locale === 'fr' && category.name_fr) {
      return category.name_fr;
    }
    return category.name_en;
  };

  if (isLoading) {
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

  if (error) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Categories</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Categories</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No categories found</p>
        </div>
      </section>
    );
  }

  return (
    <div>
      {categories.map((category) => {
        // Limit listings to 10 for category sections
        const categoryListings = category.listings.slice(0, 10);

        if (categoryListings.length === 0) {
          return null;
        }

        return (
          <section key={category.id} className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">{getCategoryName(category)}</h2>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => scrollLeft(category.id)}
                  className="p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollRight(category.id)}
                  className="p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <Link
                  href={`/search?category=${category.id}`}
                  className="ml-4 text-sm text-primary hover:text-primary/80 font-medium"
                >
                  {t('common.viewAll')}
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div 
                ref={(el) => setScrollRef(category.id, el)}
                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categoryListings.map((listing: HomepageListing) => (
                  <div key={listing.id} className="flex-shrink-0 w-64">
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
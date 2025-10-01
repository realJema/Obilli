"use client";

import { MainLayout } from "@/components/main-layout";
import { 
  Search as SearchIcon, 
  MapPin, 
  Clock, 
  Star,
  Filter
} from "lucide-react";
import { hasActiveBoost, getActiveBoostTier } from "@/lib/repositories/listings";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { CategoryWithChildren } from "@/lib/repositories/categories";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { useI18n } from "@/lib/providers";
import { SearchFilters } from "./search-filters";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Client component for interactive elements
export function SearchPageContent({ 
  searchQuery,
  categoryId,
  currentPage,
  itemsPerPage,
  categories,
  categoryBreadcrumb,
  listings,
  total,
  minPrice,
  maxPrice,
  condition,
  locationId,
  sortBy
}: {
  searchQuery: string;
  categoryId: number | undefined;
  currentPage: number;
  itemsPerPage: number;
  categories: CategoryWithChildren[];
  categoryBreadcrumb: CategoryWithChildren[];
  listings: ListingWithDetails[];
  total: number;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  condition: string | undefined;
  locationId: number | undefined;
  sortBy: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(false);

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    // Reset to first page when filters change
    params.delete('page');
    
    // Set loading state
    setFiltersLoading(true);
    
    // Simulate network delay for demonstration purposes
    setTimeout(() => {
      // Navigate with new query params
      router.push(`/search?${params.toString()}`, { scroll: false });
      
      // Reset loading state after navigation
      setTimeout(() => {
        setFiltersLoading(false);
      }, 300);
    }, 500);
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <MainLayout>
      {/* Search Header - removed search bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Breadcrumb */}
        {categoryBreadcrumb.length > 0 && (
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              {categoryBreadcrumb.map((category, index) => (
                <li key={category.id} className="inline-flex items-center">
                  <svg className="w-3 h-3 text-muted-foreground mx-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  {index < categoryBreadcrumb.length - 1 ? (
                    <Link href={`/search?category=${category.id}`} className="text-sm font-medium text-muted-foreground hover:text-primary">
                      {category.name_en}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-foreground">
                      {category.name_en}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Listings'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {total} {total === 1 ? 'result' : 'results'} found
            </p>
          </div>
          
          {/* Hide Filters Button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleFilters}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
            >
              {showFilters ? (
                <>
                  <Filter className="h-4 w-4 mr-1" />
                  Hide Filters
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4 mr-1" />
                  Show Filters
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Toggle visibility */}
          {showFilters && (
            <div className="block w-full lg:w-80 flex-shrink-0">
              <SearchFilters 
                minPrice={minPrice}
                maxPrice={maxPrice}
                condition={condition}
                locationId={locationId}
                sortBy={sortBy}
                loading={filtersLoading}
              />
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:w-[calc(100%-20rem)]" : "w-full"}>
            <SearchResults 
              listings={listings}
              total={total}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              categoryId={categoryId}
              searchQuery={searchQuery}
            />
          </div>
        </div>
        
        {/* Additional spacing at the bottom to prevent footer from being too close */}
        <div className="h-32"></div>
      </div>
    </MainLayout>
  );
}

// Server-side search results component
function SearchResults({ 
  listings,
  total,
  currentPage,
  itemsPerPage,
  categoryId,
  searchQuery
}: {
  listings: ListingWithDetails[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
  categoryId?: number;
  searchQuery?: string;
}) {
  // Simplified listing card for server-side rendering
  function ServerListingCard({ listing }: { listing: ListingWithDetails }) {
    const { formatRelativeTime } = useI18n();
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
          <div className="relative aspect-[3/2]">
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
          
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors min-h-[2rem] text-sm">
              {listing.title}
            </h3>
            
            {listing.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                {listing.description}
              </p>
            )}
            
            {listing.price_xaf && listing.price_xaf > 0 ? (
              <div className="text-lg font-bold text-primary mb-2">
                FCFA {listing.price_xaf.toLocaleString()}
              </div>
            ) : (
              <div className="text-lg font-bold text-primary mb-2">
                Negotiable
              </div>
            )}
            
            <div className="mt-auto space-y-1">
              {getLocationDisplay() && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {getLocationDisplay()}
                </div>
              )}
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {listing.created_at ? formatRelativeTime(listing.created_at) : 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
  if (listings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">No listings found</p>
        <p>Try adjusting your search criteria</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <ServerListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      
      {/* Pagination */}
      {total > itemsPerPage && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              className={`px-3 py-2 rounded-md ${
                currentPage === 1 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, Math.ceil(total / itemsPerPage)) }, (_, i) => {
              const page = i + 1;
              return (
                <Link
                  key={page}
                  href={`/search?page=${page}${categoryId ? `&category=${categoryId}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === page 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                  prefetch={true}
                >
                  {page}
                </Link>
              );
            })}
            
            <button
              className={`px-3 py-2 rounded-md ${
                currentPage === Math.ceil(total / itemsPerPage)
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-background text-foreground hover:bg-muted'
              }`}
              disabled={currentPage === Math.ceil(total / itemsPerPage)}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

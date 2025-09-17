import { MainLayout } from "@/components/main-layout";
import { 
  Search as SearchIcon, 
  MapPin, 
  Clock, 
  Star
} from "lucide-react";
import { listingsRepo, categoriesRepo } from "@/lib/repositories";
import type { ListingWithDetails, ListingFilters } from "@/lib/repositories/listings";
import { hasActiveBoost, getActiveBoostTier } from "@/lib/repositories/listings";
import type { CategoryWithChildren } from "@/lib/repositories/categories";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { Suspense } from "react";
import { cache } from 'react';
import { SearchFilters } from "./search-filters";

// More granular suspense boundaries for better loading experience
function GranularSuspenseWrapper({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Server-side data fetching functions with background refresh
interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    location?: string;
    sortBy?: string;
  }>;
}

// Server component for the search page with background refresh
export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Properly await searchParams
  const params = await searchParams;
  
  const searchQuery = params.q || '';
  const categoryId = params.category ? Number(params.category) : undefined;
  const currentPage = params.page ? Number(params.page) : 1;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const condition = params.condition || undefined;
  const locationId = params.location ? Number(params.location) : undefined;
  const sortBy = params.sortBy || 'created_at_desc';
  const itemsPerPage = 20;

  // Prepare search filters
  const searchFilters: ListingFilters = {
    search: searchQuery || undefined,
    category_id: categoryId,
    min_price: minPrice,
    max_price: maxPrice,
    condition: condition,
    location_id: locationId,
  };

  // Prepare sort options with proper typing
  let sortOptions: { field: 'created_at' | 'price_xaf' | 'updated_at' | 'title'; direction: 'asc' | 'desc' } = { 
    field: 'created_at', 
    direction: 'desc' 
  };
  
  if (sortBy === 'price_asc') {
    sortOptions.field = 'price_xaf';
    sortOptions.direction = 'asc';
  } else if (sortBy === 'price_desc') {
    sortOptions.field = 'price_xaf';
    sortOptions.direction = 'desc';
  } else if (sortBy === 'created_at_asc') {
    sortOptions.field = 'created_at';
    sortOptions.direction = 'asc';
  }

  // Fetch categories server-side with background refresh
  const categories = await categoriesRepo.getTopLevel();
  
  // Fetch category breadcrumb if category is specified
  const categoryBreadcrumb = categoryId ? await categoriesRepo.getBreadcrumb(categoryId) : [];
  
  // Fetch listings server-side with background refresh
  const { data: listings, count: total } = await listingsRepo.getAll(
    searchFilters,
    sortOptions,
    itemsPerPage,
    (currentPage - 1) * itemsPerPage
  );

  return (
    <MainLayout>
      <GranularSuspenseWrapper fallback={<SearchPageSkeleton />}>
        <SearchPageContent 
          searchQuery={searchQuery}
          categoryId={categoryId}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          categories={categories}
          categoryBreadcrumb={categoryBreadcrumb}
          listings={listings}
          total={total}
          minPrice={minPrice}
          maxPrice={maxPrice}
          condition={condition}
          locationId={locationId}
          sortBy={sortBy}
        />
      </GranularSuspenseWrapper>
    </MainLayout>
  );
}

// Skeleton loader for the entire search page with more spacing
function SearchPageSkeleton() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        {/* Search Header Skeleton - removed search bar */}
        <div className="mb-8">
          {/* Breadcrumb Skeleton */}
          <div className="mb-4 h-4 bg-muted rounded animate-pulse w-1/3"></div>
          
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="block w-full lg:w-80">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          </div>

          {/* Results Skeleton */}
          <div className="lg:w-[calc(100%-20rem)]">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-[3/2] bg-muted"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="space-y-1 pt-2">
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Skeleton */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional spacing at the bottom */}
        <div className="h-32"></div>
      </div>
    </MainLayout>
  );
}

// Client component for interactive elements
function SearchPageContent({ 
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
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Search Header - we'll make this client-side interactive */}
      <SearchHeader 
        searchQuery={searchQuery}
        categoryBreadcrumb={categoryBreadcrumb}
        total={total}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - we can make this client-side */}
        <div className="block w-full lg:w-80">
          <div className="bg-card border border-border rounded-lg">
            <SearchFilters 
              categories={categories}
              categoryId={categoryId}
              minPrice={minPrice}
              maxPrice={maxPrice}
              condition={condition}
              locationId={locationId}
              sortBy={sortBy}
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-[calc(100%-20rem)]">
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
  );
}

// Server-side search header component
function SearchHeader({ 
  searchQuery,
  categoryBreadcrumb,
  total,
  currentPage,
  itemsPerPage
}: {
  searchQuery: string;
  categoryBreadcrumb: CategoryWithChildren[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}) {
  return (
    <div className="mb-8">
      {/* Removed the search bar as requested */}
      
      {/* Breadcrumbs */}
      {categoryBreadcrumb.length > 0 && (
        <div className="mb-4">
          <nav className="flex text-sm text-muted-foreground">
            <Link href="/search" className="hover:text-foreground transition-colors">
              All Categories
            </Link>
            {categoryBreadcrumb.map((category, index) => (
              <span key={category.id} className="flex items-center">
                <span className="mx-2">/</span>
                {index === categoryBreadcrumb.length - 1 ? (
                  <span className="text-foreground">
                    {category.name_en}
                  </span>
                ) : (
                  <Link 
                    href={`/search?category=${category.id}`} 
                    className="hover:text-foreground transition-colors"
                    prefetch={true}
                  >
                    {category.name_en}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {total} results found
        </p>
      </div>
    </div>
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
                {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'Unknown'}
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

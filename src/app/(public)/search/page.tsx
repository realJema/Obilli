"use client";

import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  Grid, 
  List,
  type LucideIcon 
} from "lucide-react";
import { listingsRepo, categoriesRepo } from "@/lib/repositories";
import type { ListingWithDetails, ListingFilters } from "@/lib/repositories/listings";
import type { CategoryWithChildren } from "@/lib/repositories/categories";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SearchFilters({ 
  filters, 
  onFiltersChange, 
  categories 
}: {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  categories: CategoryWithChildren[];
}) {
  const { t } = useI18n();
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="font-semibold flex items-center">
        <Filter className="h-5 w-5 mr-2" />
        Filters
      </h3>
      
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select 
          value={filters.category_id || ''} 
          onChange={(e) => onFiltersChange({ ...filters, category_id: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full p-2 border border-border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name_en}
            </option>
          ))}
        </select>
      </div>
      
      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <select 
          value={filters.type || ''} 
          onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as 'good' | 'service' | 'job' | undefined })}
          className="w-full p-2 border border-border rounded-md"
        >
          <option value="">All Types</option>
          <option value="good">Goods</option>
          <option value="service">Services</option>
          <option value="job">Jobs</option>
        </select>
      </div>
      
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Price Range (XAF)</label>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number" 
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) => onFiltersChange({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })}
            className="p-2 border border-border rounded-md"
          />
          <input 
            type="number" 
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) => onFiltersChange({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })}
            className="p-2 border border-border rounded-md"
          />
        </div>
      </div>
      
      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-2">City</label>
        <input 
          type="text" 
          placeholder="Enter city"
          value={filters.location_city || ''}
          onChange={(e) => onFiltersChange({ ...filters, location_city: e.target.value || undefined })}
          className="w-full p-2 border border-border rounded-md"
        />
      </div>
      
      {/* Condition */}
      <div>
        <label className="block text-sm font-medium mb-2">Condition</label>
        <select 
          value={filters.condition || ''} 
          onChange={(e) => onFiltersChange({ ...filters, condition: e.target.value || undefined })}
          className="w-full p-2 border border-border rounded-md"
        >
          <option value="">Any Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
      </div>
      
      {/* Clear Filters */}
      <button
        onClick={() => onFiltersChange({})}
        className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}

function ListingCard({ listing, viewMode }: { listing: ListingWithDetails; viewMode: 'grid' | 'list' }) {
  const { formatCurrency, formatRelativeTime } = useI18n();
  
  // Get the first media image or use default
  const imageUrl = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
  
  if (viewMode === 'list') {
    return (
      <Link href={`/listing/${listing.id}`} className="block group">
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow p-4">
          <div className="flex space-x-4">
            <div className="relative w-32 h-24 flex-shrink-0 rounded-md overflow-hidden">
              <DefaultImage
                src={imageUrl}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                {listing.title}
              </h3>
              
              {listing.price_xaf && (
                <div className="text-lg font-bold text-primary mb-2">
                  {formatCurrency(listing.price_xaf)}
                </div>
              )}
              
              {listing.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {listing.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {(listing.location_city || listing.location_region) && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {[listing.location_city, listing.location_region].filter(Boolean).join(', ')}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatRelativeTime(listing.created_at || new Date().toISOString())}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
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
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
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
            {(listing.location_city || listing.location_region) && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {[listing.location_city, listing.location_region].filter(Boolean).join(', ')}
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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoriesRepo.getTopLevel();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setIsLoading(true);
        
        const searchFilters = {
          ...filters,
          search: searchQuery || undefined,
          category_id: searchParams?.get('category') ? Number(searchParams.get('category')) : filters.category_id,
        };
        
        const { data, count } = await listingsRepo.getAll(
          searchFilters,
          { field: 'created_at', direction: 'desc' },
          20,
          0
        );
        
        setListings(data);
        setTotal(count);
      } catch (error) {
        console.error('Failed to load listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters, searchQuery, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery || undefined });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {isLoading ? 'Loading...' : `${total} results found`}
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters 
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={viewMode === 'grid' 
                    ? "bg-card border border-border rounded-lg overflow-hidden animate-pulse"
                    : "bg-card border border-border rounded-lg p-4 animate-pulse"
                  }>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-[4/3] bg-muted"></div>
                        <div className="p-4">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-6 bg-muted rounded mb-2 w-2/3"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                      </>
                    ) : (
                      <div className="flex space-x-4">
                        <div className="w-32 h-24 bg-muted rounded-md"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-6 bg-muted rounded mb-2 w-1/3"></div>
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No listings found</p>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

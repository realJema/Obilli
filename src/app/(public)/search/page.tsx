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
  ChevronUp,
  ChevronDown,
  // type LucideIcon 
} from "lucide-react";
import { listingsRepo, categoriesRepo } from "@/lib/repositories";
import type { ListingWithDetails, ListingFilters } from "@/lib/repositories/listings";
import { hasActiveBoost, getActiveBoostTier } from "@/lib/repositories/listings";
import type { CategoryWithChildren } from "@/lib/repositories/categories";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Update the SearchFilters component with proper dark mode classes
function SearchFilters({ 
  filters, 
  onFiltersChange, 
  categories 
}: {
  filters: ListingFilters;
  onFiltersChange: (filters: ListingFilters) => void;
  categories: CategoryWithChildren[];
}) {
  const { t, locale } = useI18n();
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="font-semibold flex items-center text-foreground">
        <Filter className="h-5 w-5 mr-2" />
        {t('common.filter')}
      </h3>
      
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">{t('listing.category')}</label>
        <select 
          value={filters.category_id || ''} 
          onChange={(e) => onFiltersChange({ ...filters, category_id: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">{t('search.allCategories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="bg-background text-foreground">
              {locale === 'fr' ? category.name_fr : category.name_en}
            </option>
          ))}
        </select>
      </div>
      
      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">{t('listing.type')}</label>
        <select 
          value={filters.type || ''} 
          onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as 'good' | 'service' | 'job' | undefined })}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">{t('search.allTypes')}</option>
          <option value="good" className="bg-background text-foreground">{t('search.goods')}</option>
          <option value="service" className="bg-background text-foreground">{t('search.services')}</option>
          <option value="job" className="bg-background text-foreground">{t('search.jobs')}</option>
        </select>
      </div>
      
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">{t('search.priceRange')}</label>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="number" 
            placeholder={t('search.min')}
            value={filters.min_price || ''}
            onChange={(e) => onFiltersChange({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })}
            className="p-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground"
          />
          <input 
            type="number" 
            placeholder={t('search.max')}
            value={filters.max_price || ''}
            onChange={(e) => onFiltersChange({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })}
            className="p-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>
      
      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">{t('search.region')}</label>
        <select 
          value={filters.region_id || ''} 
          onChange={(e) => onFiltersChange({ ...filters, region_id: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">{t('search.anyRegion')}</option>
          <option value="2" className="bg-background text-foreground">Centre</option>
          <option value="5" className="bg-background text-foreground">Littoral</option>
          <option value="7" className="bg-background text-foreground">Northwest</option>
          <option value="10" className="bg-background text-foreground">West</option>
          <option value="9" className="bg-background text-foreground">Southwest</option>
          <option value="1" className="bg-background text-foreground">Adamawa</option>
          <option value="3" className="bg-background text-foreground">East</option>
          <option value="4" className="bg-background text-foreground">Far North</option>
          <option value="6" className="bg-background text-foreground">North</option>
          <option value="8" className="bg-background text-foreground">South</option>
        </select>
      </div>
      
      {/* Condition */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">{t('listing.condition')}</label>
        <select 
          value={filters.condition || ''} 
          onChange={(e) => onFiltersChange({ ...filters, condition: e.target.value || undefined })}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">{t('search.anyCondition')}</option>
          <option value="new" className="bg-background text-foreground">{t('conditions.new')}</option>
          <option value="used" className="bg-background text-foreground">{t('conditions.used')}</option>
          <option value="refurbished" className="bg-background text-foreground">{t('conditions.refurbished')}</option>
        </select>
      </div>
      
      {/* Clear Filters */}
      <button
        onClick={() => onFiltersChange({})}
        className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {t('search.clearAllFilters')}
      </button>
    </div>
  );
}

function ListingCard({ listing, viewMode }: { listing: ListingWithDetails; viewMode: 'grid' | 'list' }) {
  const { formatCurrency, formatRelativeTime, t } = useI18n();
  
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
              
              {listing.price_xaf && listing.price_xaf > 0 ? (
                <div className="text-lg font-bold text-primary mb-2">
                  {formatCurrency(listing.price_xaf)}
                </div>
              ) : (
                <div className="text-lg font-bold text-primary mb-2">
                  {t('listing.negotiable')}
                </div>
              )}

              {listing.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {listing.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {getLocationDisplay() && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {getLocationDisplay()}
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
              {formatCurrency(listing.price_xaf)}
            </div>
          ) : (
            <div className="text-lg font-bold text-primary mb-2">
              {t('listing.negotiable')}
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
              {formatRelativeTime(listing.created_at || new Date().toISOString())}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading search...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const { locale, t } = useI18n();
  
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [categoryBreadcrumb, setCategoryBreadcrumb] = useState<CategoryWithChildren[]>([]);
  const [filters, setFilters] = useState<ListingFilters>({});
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
    const loadCategoryBreadcrumb = async () => {
      const categoryId = searchParams?.get('category');
      if (categoryId) {
        try {
          const breadcrumb = await categoriesRepo.getBreadcrumb(Number(categoryId));
          setCategoryBreadcrumb(breadcrumb);
        } catch (error) {
          console.error('Failed to load category breadcrumb:', error);
        }
      } else {
        setCategoryBreadcrumb([]);
      }
    };

    loadCategoryBreadcrumb();
  }, [searchParams]);

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
          itemsPerPage,
          (currentPage - 1) * itemsPerPage
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
  }, [filters, searchQuery, searchParams, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery || undefined });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                placeholder={t('search.placeholder')}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                {t('common.search')}
              </button>
            </div>
          </form>
          
          {/* Breadcrumbs */}
          {categoryBreadcrumb.length > 0 && (
            <div className="mb-4">
              <nav className="flex text-sm text-muted-foreground">
                <Link href="/search" className="hover:text-foreground transition-colors">
                  {t('search.allCategories')}
                </Link>
                {categoryBreadcrumb.map((category, index) => (
                  <span key={category.id} className="flex items-center">
                    <span className="mx-2">/</span>
                    {index === categoryBreadcrumb.length - 1 ? (
                      <span className="text-foreground">
                        {locale === 'fr' ? category.name_fr : category.name_en}
                      </span>
                    ) : (
                      <Link 
                        href={`/search?category=${category.id}`} 
                        className="hover:text-foreground transition-colors"
                      >
                        {locale === 'fr' ? category.name_fr : category.name_en}
                      </Link>
                    )}
                  </span>
                ))}
              </nav>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {isLoading ? t('common.loading') : t('search.resultsFound').replace('{count}', total.toString())}
            </p>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
                title={t('search.gridView')}
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
                title={t('search.listView')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Filter Toggle Button */}
          <div className="mt-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              {showFilters ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  {t('search.hideFilters')}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  {t('search.showFilters')}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'block w-full lg:w-80' : 'hidden'}`}>
            <div className="bg-card border border-border rounded-lg">
              <SearchFilters 
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
              />
            </div>
          </div>

          {/* Results */}
          <div className={`${showFilters ? 'lg:w-[calc(100%-20rem)]' : 'w-full'}`}>
            {isLoading ? (
              <div className={viewMode === 'grid' 
                ? `grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${showFilters ? '4' : '5'} xl:grid-cols-${showFilters ? '4' : '5'} gap-4`
                : "space-y-4"
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={viewMode === 'grid' 
                    ? "bg-card border border-border rounded-lg overflow-hidden animate-pulse"
                    : "bg-card border border-border rounded-lg p-4 animate-pulse"
                  }>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-[3/2] bg-muted"></div>
                        <div className="p-3">
                          <div className="h-3 bg-muted rounded mb-1"></div>
                          <div className="h-4 bg-muted rounded mb-2 w-2/3"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
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
                <p className="text-lg mb-2">{t('search.noListingsFound')}</p>
                <p>{t('search.tryAdjusting')}</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? `grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${showFilters ? '4' : '5'} xl:grid-cols-${showFilters ? '4' : '5'} gap-4`
                  : "space-y-4"
                }>
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} viewMode={viewMode} />
                  ))}
                </div>
                
                {/* Pagination */}
                {total > itemsPerPage && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-md ${
                          currentPage === 1 
                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                            : 'bg-background text-foreground hover:bg-muted'
                        }`}
                      >
                        {t('search.previous')}
                      </button>
                      
                      {Array.from({ length: Math.min(5, Math.ceil(total / itemsPerPage)) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-md ${
                              currentPage === page 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-background text-foreground hover:bg-muted'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(total / itemsPerPage)}
                        className={`px-3 py-2 rounded-md ${
                          currentPage === Math.ceil(total / itemsPerPage)
                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                            : 'bg-background text-foreground hover:bg-muted'
                        }`}
                      >
                        {t('search.next')}
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

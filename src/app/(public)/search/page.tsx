import { SearchPageContent } from "./page-client";
import { listingsRepo, categoriesRepo } from "@/lib/repositories";
import type { ListingWithDetails, ListingFilters } from "@/lib/repositories/listings";
import type { CategoryWithChildren } from "@/lib/repositories/categories";

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

// Helper function to get sort options
function getSortOptions(sortBy: string) {
  if (sortBy === 'price_asc') {
    return { field: 'price_xaf' as const, direction: 'asc' as const };
  } else if (sortBy === 'price_desc') {
    return { field: 'price_xaf' as const, direction: 'desc' as const };
  } else if (sortBy === 'created_at_asc') {
    return { field: 'created_at' as const, direction: 'asc' as const };
  } else {
    return { field: 'created_at' as const, direction: 'desc' as const };
  }
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
  const sortOptions = getSortOptions(sortBy);

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
  );
}
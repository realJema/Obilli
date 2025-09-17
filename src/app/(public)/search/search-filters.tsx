'use client';

import { 
  Filter, 
  DollarSign
} from "lucide-react";
import type { CategoryWithChildren } from "@/lib/repositories/categories";
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchFilters({ 
  categories,
  categoryId,
  minPrice,
  maxPrice,
  condition,
  locationId,
  sortBy
}: {
  categories: CategoryWithChildren[];
  categoryId: number | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  condition: string | undefined;
  locationId: number | undefined;
  sortBy: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
    
    // Navigate with new query params
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="font-semibold flex items-center text-foreground">
        <Filter className="h-5 w-5 mr-2" />
        Filters
      </h3>
      
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">Price Range</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="Min"
              className="w-full pl-8 pr-2 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="Max"
              className="w-full pl-8 pr-2 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
        </div>
      </div>
      
      {/* Condition */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">Condition</label>
        <select 
          value={condition || ''}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">Any Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
      </div>
      
      {/* Location - simplified for now, would need a location repository in a real implementation */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">Location</label>
        <select 
          value={locationId || ''}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">All Locations</option>
          <option value="1">Douala</option>
          <option value="2">Yaoundé</option>
          <option value="3">Bamenda</option>
          <option value="4">Buea</option>
        </select>
      </div>
      
      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium mb-2 text-foreground">Sort By</label>
        <select 
          value={sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="created_at_desc">Newest First</option>
          <option value="created_at_asc">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
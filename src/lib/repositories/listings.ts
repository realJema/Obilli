import type { Database } from '@/lib/types/database';
import { supabase } from '@/lib/db/client';
import { categoriesRepo } from './index';

type Listing = Database['public']['Tables']['listings']['Row'];
type NewListing = Database['public']['Tables']['listings']['Insert'];
type UpdateListing = Database['public']['Tables']['listings']['Update'];
type ListingWithDetails = Listing & {
  category?: Database['public']['Tables']['categories']['Row'];
  owner?: Database['public']['Tables']['profiles']['Row'];
  media?: Database['public']['Tables']['listing_media']['Row'][];
  service_packages?: Database['public']['Tables']['service_packages']['Row'][];
  boosts?: Database['public']['Tables']['boosts']['Row'][];
  location?: {
    id: number;
    location_en: string;
    location_fr: string;
    parent_id: number | null;
    city?: {
      id: number;
      location_en: string;
      location_fr: string;
      parent_id: number | null;
      region?: {
        id: number;
        location_en: string;
        location_fr: string;
        parent_id: number | null;
      };
    };
  };
};

export type { ListingWithDetails };

// Helper function to check if a listing has active boost
export function hasActiveBoost(listing: ListingWithDetails): boolean {
  if (!listing.boosts || listing.boosts.length === 0) return false;
  
  const now = new Date();
  return listing.boosts.some(boost => 
    boost.is_active && 
    boost.expires_at && 
    new Date(boost.expires_at) > now
  );
}

// Helper function to get active boost tier
export function getActiveBoostTier(listing: ListingWithDetails): string | null {
  if (!listing.boosts || listing.boosts.length === 0) return null;
  
  const now = new Date();
  const activeBoosts = listing.boosts.filter(boost => 
    boost.is_active && 
    boost.expires_at && 
    new Date(boost.expires_at) > now
  );
  
  if (activeBoosts.length === 0) return null;
  
  // Return highest tier boost (top > premium > featured)
  const tierOrder = { 'top': 3, 'premium': 2, 'featured': 1 };
  return activeBoosts.reduce((highest, boost) => {
    const currentTier = tierOrder[boost.tier as keyof typeof tierOrder] || 0;
    const highestTier = tierOrder[highest.tier as keyof typeof tierOrder] || 0;
    return currentTier > highestTier ? boost : highest;
  }).tier;
}

export interface ListingFilters {
  type?: 'good' | 'service' | 'job';
  category_id?: number;
  location_id?: number;
  region_id?: number;
  city_id?: number;
  min_price?: number;
  max_price?: number;
  condition?: string;
  search?: string;
  owner_id?: string;
}

export interface ListingSort {
  field: 'created_at' | 'updated_at' | 'price_xaf' | 'title';
  direction: 'asc' | 'desc';
}

export class ListingsRepository {
  async getAll(
    filters: ListingFilters = {},
    sort: ListingSort = { field: 'created_at', direction: 'desc' },
    limit = 20,
    offset = 0
  ): Promise<{ data: ListingWithDetails[]; count: number }> {
    let query = supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        owner:profiles(*),
        media:listing_media(*),
        service_packages(*),
        boosts(
          id,
          tier,
          is_active,
          expires_at
        ),
        location:locations!location_id(
          id,
          location_en,
          location_fr,
          parent_id,
          city:parent_id(
            id,
            location_en,
            location_fr,
            parent_id,
            region:parent_id(
              id,
              location_en,
              location_fr,
              parent_id
            )
          )
        )
      `, { count: 'exact' })
      .eq('status', 'published');

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.category_id) {
      // Get all descendant categories (including subcategories and sub-subcategories)
      const categoryIds = await categoriesRepo.getAllDescendantIds(filters.category_id);
      
      if (categoryIds.length > 0) {
        query = query.in('category_id', categoryIds);
      } else {
        // Fallback to just the specified category if no descendants found
        query = query.eq('category_id', filters.category_id);
      }
    }
    if (filters.location_id) {
      query = query.eq('location_id', filters.location_id);
    }
    if (filters.region_id) {
      // Filter by region - get all quarters in cities within this region
      const { data: regionQuarters, error: regionError } = await supabase
        .from('locations')
        .select('id')
        .or(`parent_id.in.(select id from locations where parent_id=${filters.region_id})`);
      
      if (!regionError && regionQuarters && regionQuarters.length > 0) {
        query = query.in('location_id', regionQuarters.map((l: { id: number }) => l.id));
      }
    }
    if (filters.city_id) {
      // Filter by city - get all quarters in this city
      const { data: cityQuarters, error: cityError } = await supabase
        .from('locations')
        .select('id')
        .eq('parent_id', filters.city_id);
        
      if (!cityError && cityQuarters && cityQuarters.length > 0) {
        query = query.in('location_id', cityQuarters.map((l: { id: number }) => l.id));
      }
    }
    if (filters.min_price) {
      query = query.gte('price_xaf', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price_xaf', filters.max_price);
    }
    if (filters.condition) {
      query = query.eq('condition', filters.condition);
    }
    if (filters.owner_id) {
      query = query.eq('owner_id', filters.owner_id);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }

    return { data: (data || []) as ListingWithDetails[], count: count || 0 };
  }

  async getById(id: string): Promise<ListingWithDetails | null> {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        owner:profiles(*),
        media:listing_media(*),
        service_packages(*),
        boosts(
          id,
          tier,
          is_active,
          expires_at
        ),
        location:locations!location_id(
          id,
          location_en,
          location_fr,
          parent_id,
          city:parent_id(
            id,
            location_en,
            location_fr,
            parent_id,
            region:parent_id(
              id,
              location_en,
              location_fr,
              parent_id
            )
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch listing: ${error.message}`);
    }

    return data as ListingWithDetails;
  }

  async getFeatured(limit = 6): Promise<ListingWithDetails[]> {
    // Get listings that have active boosts, prioritizing by boost tier
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        owner:profiles(*),
        media:listing_media(*),
        location:locations!location_id(
          id,
          location_en,
          location_fr,
          parent_id,
          city:parent_id(
            id,
            location_en,
            location_fr,
            parent_id,
            region:parent_id(
              id,
              location_en,
              location_fr,
              parent_id
            )
          )
        ),
        boosts!inner(
          tier,
          is_active,
          expires_at
        )
      `)
      .eq('status', 'published')
      .eq('boosts.is_active', true)
      .gte('boosts.expires_at', new Date().toISOString())
      .order('boosts.tier', { ascending: false }) // top > premium > featured
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      // Fallback to regular listings if boost query fails
      console.warn('Failed to fetch boosted listings, falling back to regular:', error.message);
      return this.getRegularFeatured(limit);
    }

    // If we don't have enough boosted listings, fill with regular listings
    if (!data || data.length < limit) {
      const boostedIds = data?.map((listing: { id: string }) => listing.id) || [];
      const regularListings = await this.getRegularFeatured(limit - (data?.length || 0), boostedIds);
      return [...(data || []), ...regularListings] as ListingWithDetails[];
    }

    return (data || []) as ListingWithDetails[];
  }

  private async getRegularFeatured(limit: number, excludeIds: string[] = []): Promise<ListingWithDetails[]> {
    let query = supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        owner:profiles(*),
        media:listing_media(*),
        boosts(
          id,
          tier,
          is_active,
          expires_at
        ),
        location:locations!location_id(
          id,
          location_en,
          location_fr,
          parent_id,
          city:parent_id(
            id,
            location_en,
            location_fr,
            parent_id,
            region:parent_id(
              id,
              location_en,
              location_fr,
              parent_id
            )
          )
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.map(id => `'${id}'`).join(',')})`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch featured listings: ${error.message}`);
    }

    return (data || []) as ListingWithDetails[];
  }

  async getByOwner(ownerId: string, status?: string): Promise<ListingWithDetails[]> {
    let query = supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        media:listing_media(*),
        service_packages(*)
      `)
      .eq('owner_id', ownerId);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch user listings: ${error.message}`);
    }

    return (data || []) as ListingWithDetails[];
  }

  async create(listing: NewListing): Promise<Listing> {
    const { data, error } = await supabase
      .from('listings')
      .insert(listing)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create listing: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updates: UpdateListing): Promise<Listing> {
    const updateData = { ...updates, updated_at: new Date().toISOString() };
    
    // First check if listing exists and user has permission
    const { data: existingListing, error: checkError } = await supabase
      .from('listings')
      .select('id, owner_id, status')
      .eq('id', id)
      .single();

    if (checkError) {
      throw new Error(`Listing not found: ${checkError.message}`);
    }
    
    if (!existingListing) {
      throw new Error('Listing not found');
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user owns the listing
    if (existingListing.owner_id !== user.id) {
      throw new Error('You do not have permission to update this listing');
    }

    // Now perform the update with explicit user context
    const { data, error } = await supabase
      .from('listings')
      .update(updateData)
      .eq('id', id)
      .eq('owner_id', user.id)  // Extra safety check
      .select()
      .single();  // Use single() since we expect exactly one row

    if (error) {
      throw new Error(`Failed to update listing: ${error.message}`);
    }

    if (!data) {
      throw new Error('Failed to update listing: No data returned');
    }

    return data as Listing;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete listing: ${error.message}`);
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    // For now, just update the view_count directly since we don't have the RPC function
    const { data: currentListing } = await supabase
      .from('listings')
      .select('view_count')
      .eq('id', id)
      .single();
      
    if (currentListing) {
      const currentCount = (currentListing as { view_count?: number }).view_count || 0;
      await supabase
        .from('listings')
        .update({ view_count: currentCount + 1 })
        .eq('id', id);
    }
  }

  async search(query: string, filters: ListingFilters = {}, limit = 20): Promise<ListingWithDetails[]> {
    const { data } = await this.getAll(
      { ...filters, search: query },
      { field: 'created_at', direction: 'desc' },
      limit,
      0
    );

    return data;
  }
}

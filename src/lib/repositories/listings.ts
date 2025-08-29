import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';

type Listing = Database['public']['Tables']['listings']['Row'];
type NewListing = Database['public']['Tables']['listings']['Insert'];
type UpdateListing = Database['public']['Tables']['listings']['Update'];
type ListingWithDetails = Listing & {
  category?: Database['public']['Tables']['categories']['Row'];
  owner?: Database['public']['Tables']['profiles']['Row'];
  media?: Database['public']['Tables']['listing_media']['Row'][];
  service_packages?: Database['public']['Tables']['service_packages']['Row'][];
};

export type { ListingWithDetails };

export interface ListingFilters {
  type?: 'good' | 'service' | 'job';
  category_id?: number;
  location_city?: string;
  location_region?: string;
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
        service_packages(*)
      `, { count: 'exact' })
      .eq('status', 'published');

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.location_city) {
      query = query.eq('location_city', filters.location_city);
    }
    if (filters.location_region) {
      query = query.eq('location_region', filters.location_region);
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

    return { data: data || [], count: count || 0 };
  }

  async getById(id: string): Promise<ListingWithDetails | null> {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        owner:profiles(*),
        media:listing_media(*),
        service_packages(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch listing: ${error.message}`);
    }

    return data;
  }

  async getFeatured(limit = 6): Promise<ListingWithDetails[]> {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        owner:profiles(*),
        media:listing_media(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured listings: ${error.message}`);
    }

    return data || [];
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

    return data || [];
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
    const { data, error } = await supabase
      .from('listings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update listing: ${error.message}`);
    }

    return data;
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
    const { error } = await supabase.rpc('increment_listing_views', { listing_id: id });

    if (error) {
      console.error('Failed to increment view count:', error.message);
      // Don't throw error for analytics - it shouldn't break the user experience
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

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
          parent_id
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
          parent_id
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

    // If we have a location, fetch the full hierarchy
    if (data && data.location_id) {
      try {
        const locationHierarchy = await this.getLocationHierarchy(data.location_id);
        if (locationHierarchy) {
          (data as ListingWithDetails).location = locationHierarchy;
        }
      } catch (locationError) {
        console.warn('Failed to fetch location hierarchy:', locationError);
      }
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
          parent_id
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
          parent_id
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

  // Get optimized homepage data with a single query
  async getHomepageData(): Promise<{
    heroListings: HomepageListing[];
    featuredListings: HomepageListing[];
    recentListings: HomepageListing[];
    trendingListings: HomepageListing[];
    categories: HomepageCategory[];
  }> {
    try {
      // Get featured listings (boosted listings) with essential data - limit to 10
      const { data: featuredListingsData, error: featuredError } = await supabase
        .from('listings')
        .select(`
          id, title, price_xaf, description, created_at,
          category:categories(id, name_en, name_fr),
          owner:profiles(id, username),
          media:listing_media(url),
          location:locations!location_id(
            id,
            location_en,
            location_fr,
            parent_id
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10);

      if (featuredError) throw featuredError;

      // Get recently added listings - limit to 10
      const { data: recentListingsData, error: recentError } = await supabase
        .from('listings')
        .select(`
          id, title, price_xaf, description, created_at,
          category:categories(id, name_en, name_fr),
          owner:profiles(id, username),
          media:listing_media(url),
          location:locations!location_id(
            id,
            location_en,
            location_fr,
            parent_id
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      // Get trending listings (simplified - just recent listings for now) - limit to 10
      const trendingListingsData = [...(recentListingsData || [])].sort(() => Math.random() - 0.5).slice(0, 10);

      // Get hero listings (top 5 most recent) - limit to 5
      const heroListingsData = (recentListingsData || []).slice(0, 5);

      // Get top categories with their listings - limit to 8 categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          id, name_en, name_fr, slug
        `)
        .is('parent_id', null)
        .limit(8);

      if (categoriesError) throw categoriesError;

      // Get listings for each category (including subcategories) - limit to 10 per category
      const categoryListings: { [key: number]: HomepageListing[] } = {};
      if (categoriesData) {
        for (const category of categoriesData) {
          // Get all descendant category IDs (including the category itself)
          const categoryIds = await categoriesRepo.getAllDescendantIds(category.id);
          
          const { data: listings, error } = await supabase
            .from('listings')
            .select(`
              id, title, price_xaf, description, created_at,
              category:categories(id, name_en, name_fr),
              owner:profiles(id, username),
              media:listing_media(url),
              location:locations!location_id(
                id,
                location_en,
                location_fr,
                parent_id
              )
            `)
            .eq('status', 'published')
            .in('category_id', categoryIds)
            .order('created_at', { ascending: false })
            .limit(10); // Limit to 10 listings per category

          if (!error && listings) {
            categoryListings[category.id] = listings;
          }
        }
      }

      // Add listings to each category
      const categoriesWithListings = (categoriesData || []).map(category => ({
        ...category,
        listings: categoryListings[category.id] || []
      }));

      return {
        heroListings: heroListingsData || [],
        featuredListings: featuredListingsData || [],
        recentListings: recentListingsData || [],
        trendingListings: trendingListingsData,
        categories: categoriesWithListings as HomepageCategory[]
      };
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      return {
        heroListings: [],
        featuredListings: [],
        recentListings: [],
        trendingListings: [],
        categories: []
      };
    }
  }

  // Get hero listings (top 5 most recent) - for server-side fetching
  async getHeroListings(limit: number): Promise<HomepageListing[]> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id, title, price_xaf, description, created_at,
          category:categories(id, name_en, name_fr),
          owner:profiles(id, username),
          media:listing_media(url),
          location:locations!location_id(
            id,
            location_en,
            location_fr,
            parent_id
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching hero listings:', error);
      return [];
    }
  }

  // Get featured listings (boosted listings) - for server-side fetching
  async getFeaturedListings(limit: number): Promise<HomepageListing[]> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id, title, price_xaf, description, created_at,
          category:categories(id, name_en, name_fr),
          owner:profiles(id, username),
          media:listing_media(url),
          location:locations!location_id(
            id,
            location_en,
            location_fr,
            parent_id
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      return [];
    }
  }

  // Get trending listings - for client-side fetching
  async getTrendingListings(limit: number): Promise<HomepageListing[]> {
    try {
      // For database-level random ordering, we'll use a different approach
      // First, get the total count of published listings
      const { count, error: countError } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (countError) throw countError;
      
      if (!count || count === 0) return [];
      
      // Generate random offsets to select random listings
      const randomOffsets = Array.from({ length: Math.min(limit, count) }, () => 
        Math.floor(Math.random() * count)
      );
      
      // Remove duplicates
      const uniqueOffsets = [...new Set(randomOffsets)];
      
      // Fetch listings at random offsets
      const listingPromises = uniqueOffsets.map(async (offset) => {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            id, title, price_xaf, description, created_at,
            category:categories(id, name_en, name_fr),
            owner:profiles(id, username),
            media:listing_media(url),
            location:locations!location_id(
              id,
              location_en,
              location_fr,
              parent_id
            )
          `)
          .eq('status', 'published')
          .range(offset, offset);
          
        if (error) throw error;
        return data?.[0] || null;
      });
      
      const results = await Promise.all(listingPromises);
      
      // Filter out null results and limit to requested count
      const filteredResults = results.filter((listing) => listing !== null);
      return filteredResults.slice(0, limit) as HomepageListing[];
    } catch (error) {
      console.error('Error fetching trending listings:', error);
      return [];
    }
  }

  // Get homepage categories with listings - for client-side fetching
  async getHomepageCategories(limit: number): Promise<HomepageCategory[]> {
    try {
      // Get top categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          id, name_en, name_fr, slug
        `)
        .is('parent_id', null)
        .limit(limit);

      if (categoriesError) throw categoriesError;

      // Get listings for each category (including subcategories)
      const categoryListings: { [key: number]: HomepageListing[] } = {};
      if (categoriesData) {
        // Process all categories in parallel for better performance
        const categoryPromises = categoriesData.map(async (category) => {
          // Get all descendant category IDs (including the category itself)
          const categoryIds = await categoriesRepo.getAllDescendantIds(category.id);
          
          const { data: listings, error } = await supabase
            .from('listings')
            .select(`
              id, title, price_xaf, description, created_at,
              category:categories(id, name_en, name_fr),
              owner:profiles(id, username),
              media:listing_media(url),
              location:locations!location_id(
                id,
                location_en,
                location_fr,
                parent_id
              )
            `)
            .eq('status', 'published')
            .in('category_id', categoryIds)
            .order('created_at', { ascending: false })
            .limit(10); // Limit to 10 listings per category

          if (!error && listings) {
            categoryListings[category.id] = listings;
          }
        });

        // Wait for all category listing fetches to complete
        await Promise.all(categoryPromises);
      }

      // Add listings to each category
      const categoriesWithListings = (categoriesData || []).map(category => ({
        ...category,
        listings: categoryListings[category.id] || []
      }));

      return categoriesWithListings as HomepageCategory[];
    } catch (error) {
      console.error('Error fetching homepage categories:', error);
      return [];
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

  // Helper function to build location hierarchy
  private async getLocationHierarchy(locationId: number): Promise<{
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
  } | null> {
    const { data: location, error: locationError } = await supabase
      .from('locations')
      .select(`
        id,
        location_en,
        location_fr,
        parent_id
      `)
      .eq('id', locationId)
      .single();

    if (locationError) {
      throw locationError;
    }

    if (!location) {
      return null;
    }

    const hierarchy: {
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
    } = {
      id: location.id,
      location_en: location.location_en,
      location_fr: location.location_fr,
      parent_id: location.parent_id
    };

    // If it has a parent, get the city
    if (location.parent_id) {
      const { data: city, error: cityError } = await supabase
        .from('locations')
        .select(`
          id,
          location_en,
          location_fr,
          parent_id
        `)
        .eq('id', location.parent_id)
        .single();

      if (!cityError && city) {
        hierarchy.city = {
          id: city.id,
          location_en: city.location_en,
          location_fr: city.location_fr,
          parent_id: city.parent_id
        };

        // If city has a parent, get the region
        if (city.parent_id) {
          const { data: region, error: regionError } = await supabase
            .from('locations')
            .select(`
              id,
              location_en,
              location_fr,
              parent_id
            `)
            .eq('id', city.parent_id)
            .single();

          if (!regionError && region) {
            hierarchy.city.region = {
              id: region.id,
              location_en: region.location_en,
              location_fr: region.location_fr,
              parent_id: region.parent_id
            };
          }
        }
      }
    }

    return hierarchy;
  }
}

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
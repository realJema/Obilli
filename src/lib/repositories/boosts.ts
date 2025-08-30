import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';

type Boost = Database['public']['Tables']['boosts']['Row'];
type NewBoost = Database['public']['Tables']['boosts']['Insert'];
type UpdateBoost = Database['public']['Tables']['boosts']['Update'];

export interface BoostTier {
  tier: 'featured' | 'premium' | 'top';
  name: string;
  description: string;
  duration: number; // days
  priceXaf: number;
  features: string[];
}

export const BOOST_TIERS: BoostTier[] = [
  {
    tier: 'featured',
    name: 'Featured',
    description: 'Get your listing featured in the homepage',
    duration: 7,
    priceXaf: 2000,
    features: ['Homepage visibility', 'Featured badge', '7 days duration']
  },
  {
    tier: 'premium',
    name: 'Premium',
    description: 'Priority placement in search results',
    duration: 14,
    priceXaf: 5000,
    features: ['Priority in search', 'Premium badge', 'Homepage visibility', '14 days duration']
  },
  {
    tier: 'top',
    name: 'Top',
    description: 'Maximum visibility across the platform',
    duration: 30,
    priceXaf: 10000,
    features: ['Top of search results', 'Top badge', 'Homepage priority', 'Featured in categories', '30 days duration']
  }
];

export class BoostsRepository {
  async create(boost: NewBoost): Promise<Boost> {
    const { data, error } = await supabase
      .from('boosts')
      .insert(boost)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create boost: ${error.message}`);
    }

    return data;
  }

  async getByListingId(listingId: string): Promise<Boost[]> {
    const { data, error } = await supabase
      .from('boosts')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch boosts: ${error.message}`);
    }

    return data || [];
  }

  async getByOwnerId(ownerId: string): Promise<Boost[]> {
    const { data, error } = await supabase
      .from('boosts')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user boosts: ${error.message}`);
    }

    return data || [];
  }

  async getActiveBoosts(): Promise<Boost[]> {
    const { data, error } = await supabase
      .from('boosts')
      .select('*')
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .order('tier', { ascending: false }) // top > premium > featured
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active boosts: ${error.message}`);
    }

    return data || [];
  }

  async update(id: string, updates: UpdateBoost): Promise<Boost> {
    const updateData = { ...updates, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('boosts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update boost: ${error.message}`);
    }

    return data;
  }

  async activateBoost(id: string): Promise<Boost> {
    return this.update(id, {
      is_active: true,
      payment_status: 'paid'
    });
  }

  async expireBoost(id: string): Promise<Boost> {
    return this.update(id, {
      is_active: false,
      expires_at: new Date().toISOString()
    });
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('boosts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete boost: ${error.message}`);
    }
  }

  // Get boost tier information
  getBoostTier(tier: 'featured' | 'premium' | 'top'): BoostTier | undefined {
    return BOOST_TIERS.find(t => t.tier === tier);
  }

  // Check if listing has active boost
  async hasActiveBoost(listingId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('boosts')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', listingId)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error checking active boost:', error);
      return false;
    }

    return (count || 0) > 0;
  }
}

export const boostsRepo = new BoostsRepository();
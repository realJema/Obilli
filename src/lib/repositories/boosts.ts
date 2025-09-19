import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';

type Boost = Database['public']['Tables']['boosts']['Row'];
type NewBoost = Database['public']['Tables']['boosts']['Insert'];
type UpdateBoost = Database['public']['Tables']['boosts']['Update'];
// type BoostPricing = Database['public']['Tables']['boost_pricing']['Row'];

export interface BoostTier {
  tier: 'featured' | 'premium' | 'top' | 'ads';
  name: string;
  description: string;
  duration: number; // default duration for display
  pricePerDay: number; // price per day in XAF
  features: string[];
}

// Default pricing structure (will be overridden by database values)
export const DEFAULT_BOOST_TIERS: BoostTier[] = [
  {
    tier: 'top',
    name: 'Top',
    description: 'Maximum visibility across the platform',
    duration: 30,
    pricePerDay: 500,
    features: ['First position in all sections', 'Top badge', 'Homepage priority', 'Featured in categories', 'Maximum search visibility', 'Trending section priority']
  },
  {
    tier: 'premium',
    name: 'Premium',
    description: 'Priority placement in search results',
    duration: 14,
    pricePerDay: 2000,
    features: ['Featured listings section', 'Premium badge', 'Category top position', 'Priority search ranking', 'Enhanced visibility']
  },
  {
    tier: 'featured',
    name: 'Featured',
    description: 'Get your listing featured in the homepage',
    duration: 7,
    pricePerDay: 1000,
    features: ['Homepage carousel display', 'Featured badge', 'Priority in search results', 'Enhanced visibility']
  },
  {
    tier: 'ads',
    name: 'Advertisement',
    description: 'Promote your listing as a paid advertisement',
    duration: 7,
    pricePerDay: 1500,
    features: ['Advertisement placement in feed', 'Prominent positioning', 'High visibility', 'Targeted audience reach']
  }
];

// Function to calculate price based on tier and days
export const calculateBoostPrice = async (tier: 'featured' | 'premium' | 'top' | 'ads', days: number): Promise<number> => {
  try {
    // Try to get pricing from database
    const { data, error } = await supabase
      .from('boost_pricing')
      .select('price_per_day')
      .eq('tier', tier)
      .single();
    
    if (error || !data) {
      // Fallback to default pricing
      const tierInfo = DEFAULT_BOOST_TIERS.find(t => t.tier === tier);
      return tierInfo ? tierInfo.pricePerDay * days : 0;
    }
    
    return data.price_per_day * days;
  } catch (error) {
    console.error('Error calculating boost price:', error);
    // Fallback to default pricing
    const tierInfo = DEFAULT_BOOST_TIERS.find(t => t.tier === tier);
    return tierInfo ? tierInfo.pricePerDay * days : 0;
  }
};

// Function to get all boost tiers with current pricing
export const getBoostTiers = async (): Promise<BoostTier[]> => {
  try {
    // Get pricing from database
    const { data, error } = await supabase
      .from('boost_pricing')
      .select('*');
    
    if (error || !data || data.length === 0) {
      // Fallback to default pricing
      return DEFAULT_BOOST_TIERS;
    }
    
    // Map database pricing to boost tiers
    const tiers = DEFAULT_BOOST_TIERS.map(tier => {
      const dbPricing = data.find(p => p.tier === tier.tier);
      return {
        ...tier,
        pricePerDay: dbPricing ? dbPricing.price_per_day : tier.pricePerDay
      };
    });
    
    return tiers;
  } catch (error) {
    console.error('Error fetching boost tiers:', error);
    // Fallback to default pricing
    return DEFAULT_BOOST_TIERS;
  }
};

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
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active boosts: ${error.message}`);
    }

    // Sort by tier priority (top > premium > featured > ads)
    const sortedData = (data || []).sort((a, b) => {
      return getTierPriority(b.tier) - getTierPriority(a.tier);
    });

    return sortedData;
  }

  async update(id: string, updates: UpdateBoost): Promise<Boost> {
    const updateData = { ...updates, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('boosts')
      .update(updateData)
      .eq('id', parseInt(id, 10))
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
      .eq('id', parseInt(id, 10));

    if (error) {
      throw new Error(`Failed to delete boost: ${error.message}`);
    }
  }

  // Get boost tier information
  async getBoostTier(tier: 'featured' | 'premium' | 'top' | 'ads'): Promise<BoostTier | undefined> {
    const tiers = await getBoostTiers();
    return tiers.find(t => t.tier === tier);
  }
}

// Helper function to get tier priority (higher number = higher priority)
export const getTierPriority = (tier: string): number => {
  switch (tier) {
    case 'top': return 4;
    case 'premium': return 3;
    case 'featured': return 2;
    case 'ads': return 1;
    default: return 0;
  }
};

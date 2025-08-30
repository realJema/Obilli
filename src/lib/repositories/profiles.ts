import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type NewProfile = Database['public']['Tables']['profiles']['Insert'];
type UpdateProfile = Database['public']['Tables']['profiles']['Update'];

export interface ProfileWithStats extends Profile {
  listing_count?: number;
  review_count?: number;
  average_rating?: number;
}

export class ProfilesRepository {
  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  async getByUsername(username: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  async getWithStats(id: string): Promise<ProfileWithStats | null> {
    const profile = await this.getById(id);
    if (!profile) return null;

    // Get listing count
    const { count: listingCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', id)
      .eq('status', 'published');

    // Get review stats
    const { data: reviewStats } = await supabase
      .from('reviews')
      .select('rating')
      .eq('seller_id', id);

    const reviewCount = reviewStats?.length || 0;
    const averageRating = reviewCount > 0 
      ? reviewStats!.reduce((sum, review) => sum + (review.rating || 0), 0) / reviewCount
      : 0;

    return {
      ...profile,
      listing_count: listingCount || 0,
      review_count: reviewCount,
      average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    };
  }

  async create(profile: NewProfile): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updates: UpdateProfile): Promise<Profile> {
    // First check if the profile exists
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Profile not found');
    }

    // If username is being updated, validate it
    if (updates.username && updates.username !== existing.username) {
      const isAvailable = await this.checkUsernameAvailable(updates.username, id);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }

  async search(query: string, limit = 20): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search profiles: ${error.message}`);
    }

    return data || [];
  }

  async checkUsernameAvailable(username: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('username', username);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to check username availability: ${error.message}`);
    }

    return (count || 0) === 0;
  }

  async getVerifiedSellers(limit = 10): Promise<ProfileWithStats[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_verified', true)
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch verified sellers: ${error.message}`);
    }

    if (!data) return [];

    // Get stats for each profile
    const profilesWithStats = await Promise.all(
      data.map(async (profile) => {
        const stats = await this.getWithStats(profile.id);
        return stats || profile;
      })
    );

    return profilesWithStats;
  }
}

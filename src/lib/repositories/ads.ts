import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';
import { cache } from 'react';

type Ad = Database['public']['Tables']['ads']['Row'];
type NewAd = Database['public']['Tables']['ads']['Insert'];
type UpdateAd = Database['public']['Tables']['ads']['Update'];

export class AdsRepository {
  // Cache the getActiveAds method for 5 minutes
  getActiveAds = cache(async (placement?: string): Promise<Ad[]> => {
    let query = supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', new Date().toISOString())
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
      
    if (placement) {
      query = query.eq('placement', placement);
    }
    
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch ads: ${error.message}`);
    }

    return data || [];
  });

  // Cache the getById method for 5 minutes
  getById = cache(async (id: string): Promise<Ad | null> => {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch ad: ${error.message}`);
    }

    return data;
  });

  async create(ad: NewAd): Promise<Ad> {
    const { data, error } = await supabase
      .from('ads')
      .insert(ad)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ad: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updates: UpdateAd): Promise<Ad> {
    const { data, error } = await supabase
      .from('ads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ad: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete ad: ${error.message}`);
    }
  }

  async incrementClickCount(id: string): Promise<void> {
    const { data: ad } = await supabase
      .from('ads')
      .select('click_count')
      .eq('id', id)
      .single();
      
    if (ad) {
      const newCount = (ad.click_count || 0) + 1;
      await supabase
        .from('ads')
        .update({ click_count: newCount })
        .eq('id', id);
    }
  }

  async incrementImpressionCount(id: string): Promise<void> {
    const { data: ad } = await supabase
      .from('ads')
      .select('impression_count')
      .eq('id', id)
      .single();
      
    if (ad) {
      const newCount = (ad.impression_count || 0) + 1;
      await supabase
        .from('ads')
        .update({ impression_count: newCount })
        .eq('id', id);
    }
  }
}
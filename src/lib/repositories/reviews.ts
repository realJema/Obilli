import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';

type Review = Database['public']['Tables']['reviews']['Row'];
type NewReview = Database['public']['Tables']['reviews']['Insert'];
type UpdateReview = Database['public']['Tables']['reviews']['Update'];

export interface ReviewWithProfiles extends Review {
  reviewer?: Database['public']['Tables']['profiles']['Row'];
  seller?: Database['public']['Tables']['profiles']['Row'];
  listing?: Database['public']['Tables']['listings']['Row'];
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export class ReviewsRepository {
  async getByListing(listingId: string, limit = 10, offset = 0): Promise<ReviewWithProfiles[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(*),
        listing:listings(*)
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch listing reviews: ${error.message}`);
    }

    return data || [];
  }

  async getBySeller(sellerId: string, limit = 10, offset = 0): Promise<ReviewWithProfiles[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(*),
        listing:listings(*)
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch seller reviews: ${error.message}`);
    }

    return data || [];
  }

  async getByReviewer(reviewerId: string): Promise<ReviewWithProfiles[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        seller:profiles!seller_id(*),
        listing:listings(*)
      `)
      .eq('reviewer_id', reviewerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch reviewer's reviews: ${error.message}`);
    }

    return data || [];
  }

  async getSellerStats(sellerId: string): Promise<ReviewStats> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('seller_id', sellerId);

    if (error) {
      throw new Error(`Failed to fetch seller review stats: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalReviews = data.length;
    const ratings = data.map(r => r.rating || 0);
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / totalReviews;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(rating => {
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++;
      }
    });

    return {
      total_reviews: totalReviews,
      average_rating: Math.round(averageRating * 10) / 10,
      rating_distribution: distribution
    };
  }

  async create(review: NewReview): Promise<Review> {
    // Check if user has already reviewed this seller for this listing
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('reviewer_id', review.reviewer_id)
      .eq('seller_id', review.seller_id)
      .eq('listing_id', review.listing_id)
      .single();

    if (existingReview) {
      throw new Error('You have already reviewed this seller for this listing');
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updates: UpdateReview, reviewerId: string): Promise<Review> {
    // Only allow updating own reviews
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .eq('reviewer_id', reviewerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update review: ${error.message}`);
    }

    return data;
  }

  async delete(id: string, reviewerId: string): Promise<void> {
    // Only allow deleting own reviews
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
      .eq('reviewer_id', reviewerId);

    if (error) {
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }

  async canUserReview(reviewerId: string, sellerId: string, listingId?: string): Promise<boolean> {
    // User cannot review themselves
    if (reviewerId === sellerId) {
      return false;
    }

    // Check if user has already reviewed this seller/listing combination
    let query = supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('reviewer_id', reviewerId)
      .eq('seller_id', sellerId);

    if (listingId) {
      query = query.eq('listing_id', listingId);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to check review eligibility: ${error.message}`);
    }

    return (count || 0) === 0;
  }

  async getRecent(limit = 10): Promise<ReviewWithProfiles[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviewer_id(*),
        seller:profiles!seller_id(*),
        listing:listings(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent reviews: ${error.message}`);
    }

    return data || [];
  }
}

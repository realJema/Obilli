import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';
import { cache } from 'react'; // Next.js cache function

type Review = Database['public']['Tables']['reviews']['Row'];
type NewReview = Database['public']['Tables']['reviews']['Insert'];
type UpdateReview = Database['public']['Tables']['reviews']['Update'];

export interface ReviewWithProfiles extends Review {
  reviewer?: Database['public']['Tables']['profiles']['Row'];
  seller?: Database['public']['Tables']['profiles']['Row'];
  listing?: Database['public']['Tables']['listings']['Row'] | null;
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
  // Consolidated method for fetching reviews with different levels of detail
  private async fetchReviews(
    filters: {
      listingId?: string;
      sellerId?: string;
      reviewerId?: string;
    },
    limit: number,
    offset: number,
    includeDetails: 'full' | 'minimal'
  ) {
    // Define select fields based on detail level
    let selectQuery: string;
    
    if (includeDetails === 'full') {
      selectQuery = `
        *,
        reviewer:profiles!reviewer_id(*),
        seller:profiles!seller_id(*),
        listing:listings(*)
      `;
    } else {
      // minimal
      selectQuery = `
        *,
        reviewer:profiles!reviewer_id(username, avatar_url),
        listing:listings(title)
      `;
    }

    let query = supabase
      .from('reviews')
      .select(selectQuery, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filters.listingId) {
      query = query.eq('listing_id', filters.listingId);
    }
    
    if (filters.sellerId) {
      query = query.eq('seller_id', filters.sellerId);
    }
    
    if (filters.reviewerId) {
      query = query.eq('reviewer_id', filters.reviewerId);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }

    if (!data) {
      return { data: [], count: 0 };
    }

    return { data: data as unknown as ReviewWithProfiles[], count: count || 0 };
  }

  // Cache the getByListing method for 1 minute (shorter cache for reviews)
  getByListing = cache(async (listingId: string, limit = 10, offset = 0): Promise<ReviewWithProfiles[]> => {
    const { data } = await this.fetchReviews({ listingId }, limit, offset, 'full');
    return data;
  });

  // Cache the getBySeller method for 1 minute
  getBySeller = cache(async (sellerId: string, limit = 10, offset = 0): Promise<ReviewWithProfiles[]> => {
    const { data } = await this.fetchReviews({ sellerId }, limit, offset, 'full');
    return data;
  });

  // Cache the getByReviewer method for 1 minute
  getByReviewer = cache(async (reviewerId: string): Promise<ReviewWithProfiles[]> => {
    const { data } = await this.fetchReviews({ reviewerId }, 100, 0, 'full');
    return data;
  });

  // Cache the getSellerStats method for 5 minutes
  getSellerStats = cache(async (sellerId: string): Promise<ReviewStats> => {
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
  });

  // Cache the getRecent method for 2 minutes
  getRecent = cache(async (limit = 10): Promise<ReviewWithProfiles[]> => {
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

    return data as ReviewWithProfiles[] || [];
  });

  // Cache the getRecentMinimal method for 2 minutes
  getRecentMinimal = cache(async (limit = 10): Promise<ReviewWithProfiles[]> => {
    const { data } = await this.fetchReviews({}, limit, 0, 'minimal');
    return data;
  });
}

import { supabase } from '@/lib/db/client';
import type { Database } from '@/lib/types/database';

type Listing = Database['public']['Tables']['listings']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];

type ListingAnalytics = {
  status: string;
  view_count: number | null;
};

type MessageAnalytics = {
  sender_id: string;
  recipient_id: string;
};

type ReviewAnalytics = {
  rating: number | null;
};

export interface UserAnalytics {
  listings: {
    total: number;
    published: number;
    draft: number;
    paused: number;
    expired: number;
    totalViews: number;
    averageViews: number;
  };
  messages: {
    totalSent: number;
    totalReceived: number;
    unreadReceived: number;
    recentConversations: number;
  };
  reviews: {
    totalReceived: number;
    averageRating: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  performance: {
    listingsThisMonth: number;
    viewsThisMonth: number;
    messagesThisMonth: number;
    growthRate: number; // percentage change from last month
  };
}

export class AnalyticsService {
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const [
      listingsData,
      messagesData,
      reviewsData,
      performanceData
    ] = await Promise.all([
      this.getListingsAnalytics(userId),
      this.getMessagesAnalytics(userId),
      this.getReviewsAnalytics(userId),
      this.getPerformanceAnalytics(userId)
    ]);

    return {
      listings: listingsData,
      messages: messagesData,
      reviews: reviewsData,
      performance: performanceData
    };
  }

  private async getListingsAnalytics(userId: string) {
    // Get all user's listings with their view counts
    const { data: listings, error } = await supabase
      .from('listings')
      .select('status, view_count')
      .eq('owner_id', userId);

    if (error) {
      console.error('Error fetching listings analytics:', error);
      return this.getEmptyListingsAnalytics();
    }

    const listingsArray = listings || [];
    const total = listingsArray.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const published = listingsArray.filter((l: any) => l.status === 'published').length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const draft = listingsArray.filter((l: any) => l.status === 'draft').length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paused = listingsArray.filter((l: any) => l.status === 'paused').length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expired = listingsArray.filter((l: any) => l.status === 'expired').length;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalViews = listingsArray.reduce((sum: number, listing: any) => sum + (listing.view_count || 0), 0);
    const averageViews = total > 0 ? Math.round(totalViews / total) : 0;

    return {
      total,
      published,
      draft,
      paused,
      expired,
      totalViews,
      averageViews
    };
  }

  private async getMessagesAnalytics(userId: string) {
    // Get sent messages count
    const { count: totalSent } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', userId);

    // Get received messages count
    const { count: totalReceived } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId);

    // Get unread received messages count
    const { count: unreadReceived } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .is('read_at', null);

    // Get recent conversations count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentMessages } = await supabase
      .from('messages')
      .select('sender_id, recipient_id')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Count unique conversation partners
    const conversationPartners = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentMessages?.forEach((msg: any) => {
      const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      conversationPartners.add(partnerId);
    });

    return {
      totalSent: totalSent || 0,
      totalReceived: totalReceived || 0,
      unreadReceived: unreadReceived || 0,
      recentConversations: conversationPartners.size
    };
  }

  private async getReviewsAnalytics(userId: string) {
    // Get all reviews for user as seller
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('seller_id', userId);

    if (error) {
      console.error('Error fetching reviews analytics:', error);
      return this.getEmptyReviewsAnalytics();
    }

    const reviewsArray = reviews || [];
    const totalReceived = reviewsArray.length;
    
    if (totalReceived === 0) {
      return this.getEmptyReviewsAnalytics();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalRating = reviewsArray.reduce((sum: number, review: any) => sum + (review.rating || 0), 0);
    const averageRating = Math.round((totalRating / totalReceived) * 10) / 10;

    // Calculate rating distribution
    const ratingDistribution = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      5: reviewsArray.filter((r: any) => r.rating === 5).length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      4: reviewsArray.filter((r: any) => r.rating === 4).length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      3: reviewsArray.filter((r: any) => r.rating === 3).length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      2: reviewsArray.filter((r: any) => r.rating === 2).length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      1: reviewsArray.filter((r: any) => r.rating === 1).length,
    };

    return {
      totalReceived,
      averageRating,
      ratingDistribution
    };
  }

  private async getPerformanceAnalytics(userId: string) {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    // Listings this month
    const { count: listingsThisMonth } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId)
      .gte('created_at', currentMonth.toISOString());

    // Listings last month
    const { count: listingsLastMonth } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', userId)
      .gte('created_at', lastMonth.toISOString())
      .lt('created_at', currentMonth.toISOString());

    // Views this month (approximate - we don't track view history)
    const { data: currentListings } = await supabase
      .from('listings')
      .select('view_count')
      .eq('owner_id', userId)
      .eq('status', 'published');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viewsThisMonth = currentListings?.reduce((sum: number, listing: any) => sum + (listing.view_count || 0), 0) || 0;

    // Messages this month
    const { count: messagesThisMonth } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .gte('created_at', currentMonth.toISOString());

    // Calculate growth rate based on listings
    const growthRate = listingsLastMonth && listingsLastMonth > 0 
      ? Math.round(((listingsThisMonth || 0) - listingsLastMonth) / listingsLastMonth * 100)
      : 0;

    return {
      listingsThisMonth: listingsThisMonth || 0,
      viewsThisMonth,
      messagesThisMonth: messagesThisMonth || 0,
      growthRate
    };
  }

  private getEmptyListingsAnalytics() {
    return {
      total: 0,
      published: 0,
      draft: 0,
      paused: 0,
      expired: 0,
      totalViews: 0,
      averageViews: 0
    };
  }

  private getEmptyReviewsAnalytics() {
    return {
      totalReceived: 0,
      averageRating: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    };
  }
}

export const analyticsService = new AnalyticsService();
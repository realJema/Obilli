export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          is_verified: boolean | null;
          kyc_status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean | null;
          kyc_status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_verified?: boolean | null;
          kyc_status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: number;
          slug: string;
          name_en: string;
          name_fr: string;
          parent_id: number | null;
          created_at: string | null;
          icon: string | null;
          sort_order: number | null;
        };
        Insert: {
          id?: number;
          slug: string;
          name_en: string;
          name_fr: string;
          parent_id?: number | null;
          created_at?: string | null;
          icon?: string | null;
          sort_order?: number | null;
        };
        Update: {
          id?: number;
          slug?: string;
          name_en?: string;
          name_fr?: string;
          parent_id?: number | null;
          created_at?: string | null;
          icon?: string | null;
          sort_order?: number | null;
        };
      };
      listings: {
        Row: {
          id: string;
          owner_id: string;
          category_id: number;
          type: 'good' | 'service' | 'job';
          title: string;
          description: string | null;
          price_xaf: number | null;
          negotiable: boolean | null;
          location_city: string | null;
          location_region: string | null;
          condition: string | null;
          status: 'draft' | 'pending' | 'published' | 'paused' | 'expired' | 'removed';
          expires_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          category_id: number;
          type: 'good' | 'service' | 'job';
          title: string;
          description?: string | null;
          price_xaf?: number | null;
          negotiable?: boolean | null;
          location_city?: string | null;
          location_region?: string | null;
          condition?: string | null;
          status?: 'draft' | 'pending' | 'published' | 'paused' | 'expired' | 'removed';
          expires_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          category_id?: number;
          type?: 'good' | 'service' | 'job';
          title?: string;
          description?: string | null;
          price_xaf?: number | null;
          negotiable?: boolean | null;
          location_city?: string | null;
          location_region?: string | null;
          condition?: string | null;
          status?: 'draft' | 'pending' | 'published' | 'paused' | 'expired' | 'removed';
          expires_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      listing_media: {
        Row: {
          id: number;
          listing_id: string;
          url: string;
          kind: 'image' | 'video';
          position: number | null;
        };
        Insert: {
          id?: number;
          listing_id: string;
          url: string;
          kind?: 'image' | 'video';
          position?: number | null;
        };
        Update: {
          id?: number;
          listing_id?: string;
          url?: string;
          kind?: 'image' | 'video';
          position?: number | null;
        };
      };
      service_packages: {
        Row: {
          id: number;
          listing_id: string;
          tier: 'basic' | 'standard' | 'premium';
          name: string | null;
          description: string | null;
          price_xaf: number;
          delivery_days: number;
        };
        Insert: {
          id?: number;
          listing_id: string;
          tier: 'basic' | 'standard' | 'premium';
          name?: string | null;
          description?: string | null;
          price_xaf: number;
          delivery_days: number;
        };
        Update: {
          id?: number;
          listing_id?: string;
          tier?: 'basic' | 'standard' | 'premium';
          name?: string | null;
          description?: string | null;
          price_xaf?: number;
          delivery_days?: number;
        };
      };
      messages: {
        Row: {
          id: number;
          listing_id: string | null;
          sender_id: string;
          recipient_id: string;
          content: string;
          created_at: string | null;
          read_at: string | null;
        };
        Insert: {
          id?: number;
          listing_id?: string | null;
          sender_id: string;
          recipient_id: string;
          content: string;
          created_at?: string | null;
          read_at?: string | null;
        };
        Update: {
          id?: number;
          listing_id?: string | null;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
          created_at?: string | null;
          read_at?: string | null;
        };
      };
      reviews: {
        Row: {
          id: number;
          reviewer_id: string;
          seller_id: string;
          listing_id: string | null;
          rating: number | null;
          comment: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          reviewer_id: string;
          seller_id: string;
          listing_id?: string | null;
          rating?: number | null;
          comment?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          reviewer_id?: string;
          seller_id?: string;
          listing_id?: string | null;
          rating?: number | null;
          comment?: string | null;
          created_at?: string | null;
        };
      };
    };
  };
}

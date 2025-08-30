export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          phone: string | null;
          whatsapp_number: string | null;
          show_phone: boolean | null;
          show_whatsapp: boolean | null;
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
          whatsapp_number?: string | null;
          show_phone?: boolean | null;
          show_whatsapp?: boolean | null;
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
          whatsapp_number?: string | null;
          show_phone?: boolean | null;
          show_whatsapp?: boolean | null;
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
          location_id: number | null;
          condition: string | null;
          status: 'draft' | 'pending' | 'published' | 'paused' | 'expired' | 'removed';
          view_count: number | null;
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
          location_id?: number | null;
          condition?: string | null;
          status?: 'draft' | 'pending' | 'published' | 'paused' | 'expired' | 'removed';
          view_count?: number | null;
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
          location_id?: number | null;
          condition?: string | null;
          status?: 'draft' | 'pending' | 'published' | 'paused' | 'expired' | 'removed';
          view_count?: number | null;
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
          title: string | null;
          comment: string | null;
          is_verified: boolean | null;
          helpful_votes: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          reviewer_id: string;
          seller_id: string;
          listing_id?: string | null;
          rating?: number | null;
          title?: string | null;
          comment?: string | null;
          is_verified?: boolean | null;
          helpful_votes?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          reviewer_id?: string;
          seller_id?: string;
          listing_id?: string | null;
          rating?: number | null;
          title?: string | null;
          comment?: string | null;
          is_verified?: boolean | null;
          helpful_votes?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      locations: {
        Row: {
          id: number;
          location_en: string;
          location_fr: string;
          parent_id: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          location_en: string;
          location_fr: string;
          parent_id?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          location_en?: string;
          location_fr?: string;
          parent_id?: number | null;
          created_at?: string | null;
        };
      };
      boosts: {
        Row: {
          id: number;
          listing_id: string;
          owner_id: string;
          tier: 'featured' | 'premium' | 'top';
          starts_at: string;
          expires_at: string;
          price_xaf: number;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          is_active: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          listing_id: string;
          owner_id: string;
          tier: 'featured' | 'premium' | 'top';
          starts_at?: string;
          expires_at: string;
          price_xaf: number;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          listing_id?: string;
          owner_id?: string;
          tier?: 'featured' | 'premium' | 'top';
          starts_at?: string;
          expires_at?: string;
          price_xaf?: number;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ads: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number
          image_url: string | null
          link_url: string | null
          placement: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          link_url?: string | null
          placement: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          link_url?: string | null
          placement?: string
        }
        Relationships: []
      }
      boosts: {
        Row: {
          created_at: string | null
          expires_at: string
          id: number
          is_active: boolean
          listing_id: string
          owner_id: string | null
          payment_status: string
          price_xaf: number
          starts_at: string
          tier: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: number
          is_active?: boolean
          listing_id: string
          owner_id?: string | null
          payment_status?: string
          price_xaf?: number
          starts_at?: string
          tier: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: number
          is_active?: boolean
          listing_id?: string
          owner_id?: string | null
          payment_status?: string
          price_xaf?: number
          starts_at?: string
          tier?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boosts_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boosts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: number
          name_en: string
          name_fr: string
          parent_id: number | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: number
          name_en: string
          name_fr: string
          parent_id?: number | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: number
          name_en?: string
          name_fr?: string
          parent_id?: number | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_media: {
        Row: {
          id: number
          kind: string
          listing_id: string
          position: number | null
          url: string
        }
        Insert: {
          id?: number
          kind?: string
          listing_id: string
          position?: number | null
          url: string
        }
        Update: {
          id?: number
          kind?: string
          listing_id?: string
          position?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category_id: number
          condition: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          location_id: number | null
          negotiable: boolean | null
          owner_id: string
          price_xaf: number | null
          status: string
          title: string
          type: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category_id: number
          condition?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          location_id?: number | null
          negotiable?: boolean | null
          owner_id: string
          price_xaf?: number | null
          status?: string
          title: string
          type: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category_id?: number
          condition?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          location_id?: number | null
          negotiable?: boolean | null
          owner_id?: string
          price_xaf?: number | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          id: number
          location_en: string
          location_fr: string
          parent_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          location_en: string
          location_fr: string
          parent_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          location_en?: string
          location_fr?: string
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: number
          listing_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          listing_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          listing_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_flags: {
        Row: {
          created_at: string | null
          id: number
          listing_id: string
          reason: string
          reporter_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          listing_id: string
          reason: string
          reporter_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          listing_id?: string
          reason?: string
          reporter_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_flags_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_flags_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_xaf: number
          created_at: string | null
          currency: string
          id: string
          listing_id: string
          provider: string
          provider_ref: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount_xaf: number
          created_at?: string | null
          currency?: string
          id?: string
          listing_id: string
          provider: string
          provider_ref?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount_xaf?: number
          created_at?: string | null
          currency?: string
          id?: string
          listing_id?: string
          provider?: string
          provider_ref?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          kyc_status: string | null
          phone: string | null
          show_phone: boolean | null
          show_whatsapp: boolean | null
          updated_at: string | null
          username: string | null
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          kyc_status?: string | null
          phone?: string | null
          show_phone?: boolean | null
          show_whatsapp?: boolean | null
          updated_at?: string | null
          username?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          kyc_status?: string | null
          phone?: string | null
          show_phone?: boolean | null
          show_whatsapp?: boolean | null
          updated_at?: string | null
          username?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          listing_id: string | null
          rating: number
          reviewer_id: string
          seller_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          listing_id?: string | null
          rating: number
          reviewer_id: string
          seller_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          listing_id?: string | null
          rating?: number
          reviewer_id?: string
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_packages: {
        Row: {
          delivery_days: number
          description: string | null
          id: number
          listing_id: string
          name: string | null
          price_xaf: number
          tier: string
        }
        Insert: {
          delivery_days: number
          description?: string | null
          id?: number
          listing_id: string
          name?: string | null
          price_xaf: number
          tier: string
        }
        Update: {
          delivery_days?: number
          description?: string | null
          id?: number
          listing_id?: string
          name?: string | null
          price_xaf?: number
          tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_packages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deactivate_expired_boosts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

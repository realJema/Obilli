"use client";

import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import { MapPin, Clock, Star } from "lucide-react";
import { useI18n } from "@/lib/providers";

interface HomepageListing {
  id: string;
  title: string;
  price_xaf: number | null;
  description: string | null;
  created_at: string | null;
  category?: {
    id: number;
    name_en: string;
    name_fr: string;
  };
  owner?: {
    id: string;
    username: string | null;
  };
  media?: {
    url: string;
  }[];
  location?: {
    id: number;
    location_en: string;
    location_fr: string;
  } | null;
}

export function ListingCard({ listing }: { listing: HomepageListing }) {
  const { formatCurrency, formatRelativeTime, locale, t } = useI18n();
  
  // Get the first media image or use default
  const imageUrl = listing.media && listing.media.length > 0 
    ? listing.media[0].url 
    : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
  
  // For homepage listings, we won't show boost badges since we don't fetch boost data
  const isActivelyBoosted = false;
  const boostTier = null;
  
  // Build location display from hierarchical data
  const getLocationDisplay = () => {
    if (!listing.location) return null;
    
    // Use the location name based on the current locale
    if (locale === 'fr' && listing.location.location_fr) {
      return listing.location.location_fr;
    }
    return listing.location.location_en;
  };
  
  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-[3/2]">
          <DefaultImage
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Show featured badge only for actively boosted listings */}
          {isActivelyBoosted && boostTier && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1" />
              {boostTier === 'top' ? 'Top' : boostTier === 'premium' ? 'Premium' : 'Featured'}
            </div>
          )}
        </div>
        
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors min-h-[2rem] text-sm">
            {listing.title}
          </h3>
          
          {listing.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
              {listing.description}
            </p>
          )}
          
          {/* Show price or "Negotiable" if no price or price is 0 */}
          <div className="text-lg font-bold text-primary mb-2">
            {listing.price_xaf && listing.price_xaf > 0 
              ? formatCurrency(listing.price_xaf) 
              : t('listing.negotiable')}
          </div>
          
          <div className="mt-auto space-y-1">
            {getLocationDisplay() && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {getLocationDisplay()}
              </div>
            )}
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatRelativeTime(listing.created_at || new Date().toISOString())}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
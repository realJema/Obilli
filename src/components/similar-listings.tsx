'use client';

import { Clock, Package } from "lucide-react";
import Link from "next/link";
import { DefaultImage } from "@/components/default-image";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import { useI18n } from "@/lib/providers";

export function SimilarListings({ 
  categoryId, 
  currentListingId, 
  initialListings 
}: { 
  categoryId: number; 
  currentListingId: string;
  initialListings: ListingWithDetails[];
}) {
  const { t } = useI18n();
  
  return (
    <div className="py-8">
      <h3 className="text-xl font-semibold mb-6">{t('reviews.similarListings')}</h3>
      {initialListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {initialListings.map((listing) => {
            const imageUrl = listing.media && listing.media.length > 0 
              ? listing.media[0].url 
              : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=300&auto=format&fit=crop';
            
            return (
              <Link key={listing.id} href={`/listing/${listing.id}`} className="block group">
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[3/2]">
                    <DefaultImage
                      src={imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors text-sm">
                      {listing.title}
                    </h4>
                    
                    {listing.price_xaf && listing.price_xaf > 0 ? (
                      <div className="text-lg font-bold text-primary mb-1">
                        {`FCFA ${listing.price_xaf.toLocaleString()}`}
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-primary mb-1">
                        {t('listing.negotiable')}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : t('reviews.unknownDate')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-muted-foreground">
          {t('common.noResults')}
        </div>
      )}
    </div>
  );
}
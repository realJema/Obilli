'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Eye, 
  Tag, 
  Package, 
  Share2, 
  Phone, 
  MessageCircle, 
  Shield,
  AlertCircle
} from "lucide-react";
import type { ListingWithDetails } from "@/lib/repositories/listings";
import type { Database } from "@/lib/types/database";
import { useI18n } from "@/lib/providers";
import { ShareModal } from "@/components/share-modal";

export function ListingContactCard({ 
  listing, 
  seller 
}: { 
  listing: ListingWithDetails; 
  seller: Database['public']['Tables']['profiles']['Row'] | null | undefined 
}) {
  const { t, formatRelativeTime } = useI18n();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPhoneNotification, setShowPhoneNotification] = useState(false);
  
  // Get the current URL for sharing
  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const handleContactSeller = () => {
    // For now, we'll just show a notification if no phone is available
    if (!seller?.show_phone || !seller?.phone) {
      setShowPhoneNotification(true);
      setTimeout(() => setShowPhoneNotification(false), 3000);
    } else {
      // In a real implementation, this would open a chat or message interface
      console.log("Contact seller functionality would go here");
    }
  };

  const handleCallSeller = () => {
    if (seller?.show_phone && seller?.phone) {
      window.location.href = `tel:${seller.phone}`;
    } else {
      setShowPhoneNotification(true);
      setTimeout(() => setShowPhoneNotification(false), 3000);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
        <div className="mb-6">
          <div className="text-3xl font-bold text-primary mb-1">
            {listing.price_xaf && listing.price_xaf > 0 
              ? `FCFA ${listing.price_xaf.toLocaleString()}` 
              : t('listing.negotiable')}
          </div>
          {listing.negotiable && (
            <div className="text-sm text-muted-foreground">{t('listing.negotiable')}</div>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground">
                {listing.location ? listing.location.location_en : t('listing.notSpecified')}
              </div>
              <div className="text-sm text-muted-foreground">{t('listing.location')}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground">
                {listing.created_at ? formatRelativeTime(listing.created_at) : t('listing.notSpecified')}
              </div>
              <div className="text-sm text-muted-foreground">{t('listing.posted')}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-foreground">{listing.view_count || 0} {t('listing.views')}</div>
              <div className="text-sm text-muted-foreground">{t('listing.interestLevel')}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6 pb-6 border-b border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {t('listing.condition')}:
            </span>
            <span className="font-medium capitalize">{listing.condition || t('listing.notSpecified')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Package className="h-4 w-4 mr-1" />
              {t('listing.type')}:
            </span>
            <span className="font-medium capitalize">{listing.type}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleContactSeller}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {t('listing.contactWhatsApp')}
          </button>
          
          <button
            onClick={handleCallSeller}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <Phone className="h-5 w-5 mr-2" />
            {t('listing.callDirectly')}
          </button>
        </div>

        <div className="pt-4 border-t border-border">
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors hover:bg-primary/90"
          >
            <Share2 className="h-5 w-5 mr-2" />
            {t('listing.share')}
          </button>
        </div>
      </div>

      {/* Phone Notification */}
      {showPhoneNotification && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center z-50">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>No phone number registered</span>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        listingUrl={getCurrentUrl()}
        listingTitle={listing.title}
      />
    </>
  );
}

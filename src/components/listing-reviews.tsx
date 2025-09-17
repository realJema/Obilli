'use client';

import { useState, useEffect } from 'react';
import { 
  Star, 
  User, 
  Shield, 
  MessageSquare, 
  ThumbsUp 
} from "lucide-react";
import type { ReviewWithProfiles } from "@/lib/repositories/reviews";
import { AddReviewModal } from "@/components/add-review-modal";
import { reviewsRepo } from '@/lib/repositories';
import { useI18n } from "@/lib/providers";
import { useUser } from '@supabase/auth-helpers-react';

interface ListingReviewsProps {
  listingId: string;
  sellerId: string;
  initialReviews: ReviewWithProfiles[];
}

export function ListingReviews({ 
  listingId, 
  sellerId, 
  initialReviews 
}: ListingReviewsProps) {
  const [reviews, setReviews] = useState<ReviewWithProfiles[]>(initialReviews);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const { t } = useI18n();
  const user = useUser();
  
  // Check if the current user has already reviewed this listing
  const userHasReviewed = user ? reviews.some(review => review.reviewer_id === user.id) : false;
  
  // Check if the current user is the seller of the listing
  const isSeller = user ? user.id === sellerId : false;
  
  // Check if the user can review (authenticated, not the seller, and hasn't reviewed yet)
  const canReview = user && !isSeller && !userHasReviewed;
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
    : 0;

  const handleReviewAdded = async () => {
    // Fetch the updated reviews from the server
    try {
      const updatedReviews = await reviewsRepo.getByListing(listingId, 10, 0);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error fetching updated reviews:', error);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">{t("reviews.title")}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground ml-1">({reviews.length} {t("reviews.reviews")})</span>
              </div>
            </div>
          </div>
          
          {canReview ? (
            <button
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowReviewModal(true)}
            >
              {t("reviews.writeReview")}
            </button>
          ) : (
            <button
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
              disabled
              title={
                !user 
                  ? t("reviews.loginRequired") 
                  : isSeller 
                    ? t("reviews.cannotReviewOwn") 
                    : t("reviews.alreadyReviewed")
              }
            >
              {t("reviews.writeReview")}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{review.reviewer?.username || 'Anonymous'}</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : t("reviews.unknownDate")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {review.helpful_votes !== null && review.helpful_votes !== undefined && review.helpful_votes > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {review.helpful_votes}
                    </div>
                  )}
                </div>
                
                {review.title && (
                  <h4 className="font-medium mb-2">{review.title}</h4>
                )}
                
                <p className="text-muted-foreground">{review.comment}</p>
                
                {review.is_verified && (
                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <Shield className="h-4 w-4 mr-1" />
                    Verified Purchase
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("reviews.noReviewsYet")}</p>
            </div>
          )}
        </div>
      </div>
      
      {showReviewModal && (
        <AddReviewModal
          listingId={listingId}
          sellerId={sellerId}
          onClose={() => setShowReviewModal(false)}
          onReviewAdded={handleReviewAdded}
        />
      )}
    </>
  );
}
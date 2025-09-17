'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useUser } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useI18n } from "@/lib/providers";

interface AddReviewModalProps {
  listingId: string;
  sellerId: string;
  onClose: () => void;
  onReviewAdded: () => void;
}

export function AddReviewModal({ listingId, sellerId, onClose, onReviewAdded }: AddReviewModalProps) {
  const user = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { t } = useI18n();
  
  // Create a Supabase client that's aware of the auth context
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Check if user is authenticated
    if (!user || !user.id) {
      setError(t("reviews.loginRequired"));
      setIsSubmitting(false);
      return;
    }

    // Double-check that the user is not the seller
    if (user.id === sellerId) {
      setError(t("reviews.cannotReviewOwn"));
      setIsSubmitting(false);
      return;
    }

    try {
      // Insert the review directly using the authenticated client
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          listing_id: listingId,
          seller_id: sellerId,
          reviewer_id: user.id,
          rating: rating > 0 ? rating : null, // Set rating to null if 0 (not selected)
          title,
          comment,
        }])
        .select(`
          *,
          reviewer:profiles!reviewer_id(*),
          seller:profiles!seller_id(*),
          listing:listings(*)
        `)
        .single();

      if (error) {
        // Handle specific error cases
        if (error.message.includes('duplicate key value violates unique constraint')) {
          setError(t("reviews.alreadyReviewed"));
        } else if (error.message.includes('new row violates row-level security policy')) {
          setError(t("reviews.cannotReviewOwn"));
        } else {
          throw new Error(error.message);
        }
        return;
      }

      setSuccess(true);
      // Call the callback to refresh the reviews
      onReviewAdded();
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : t("reviews.failedSubmit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">{t("reviews.writeReview")}</h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm p-2 bg-green-50 rounded">
              {t("reviews.submitSuccess")}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">{t("reviews.rating")} ({t("common.optional")})</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-muted-foreground focus:outline-none"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              {t("reviews.title")}
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder={t("reviews.titlePlaceholder")}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              {t("reviews.comment")}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              placeholder={t("reviews.commentPlaceholder")}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              disabled={isSubmitting || !user || !user.id}
            >
              {isSubmitting ? t("reviews.submitting") : t("reviews.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
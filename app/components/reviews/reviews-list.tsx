"use client"

import { useEffect, useState } from "react"
import { Star, MessageCircle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Database } from "@/lib/supabase/types"
import { ReviewForm } from "./review-form"

interface Review {
  id: string
  listing_id: string
  reviewer_id: string
  rating: number
  comment: string
  helpful_count: number
  created_at: string
  parent_id: string | null
  is_reply: boolean
  reviewer: {
    username: string
    full_name: string
    avatar_url: string | null
  }
  replies?: Review[]
}

interface ReviewsListProps {
  listingId: string
  onReviewsLoaded?: (count: number) => void
  onReviewsUpdated?: (reviews: Review[]) => void
  refreshKey?: number
}

export function ReviewsList({ 
  listingId, 
  onReviewsLoaded, 
  onReviewsUpdated,
  refreshKey = 0 
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function loadReviews() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            comment,
            helpful_count,
            created_at,
            parent_id,
            is_reply,
            reviewer:reviewer_id(
              username,
              full_name,
              avatar_url
            )
          `)
          .eq("listing_id", listingId)
          .is("parent_id", null) // Only fetch top-level reviews
          .order("created_at", { ascending: false })

        if (error) throw error

        // Fetch replies for each review
        const reviewsWithReplies = await Promise.all(
          (data || []).map(async (review) => {
            const { data: replies } = await supabase
              .from("reviews")
              .select(`
                id,
                rating,
                comment,
                helpful_count,
                created_at,
                parent_id,
                is_reply,
                reviewer:reviewer_id(
                  username,
                  full_name,
                  avatar_url
                )
              `)
              .eq("parent_id", review.id)
              .order("created_at", { ascending: true })

            return {
              ...review,
              reviewer: Array.isArray(review.reviewer) ? review.reviewer[0] : review.reviewer,
              replies: replies?.map(reply => ({
                ...reply,
                reviewer: Array.isArray(reply.reviewer) ? reply.reviewer[0] : reply.reviewer
              }))
            }
          })
        )

        setReviews(reviewsWithReplies as Review[])
        onReviewsLoaded?.(reviewsWithReplies.length)
        onReviewsUpdated?.(reviewsWithReplies)
      } catch (error) {
        console.error("Error loading reviews:", error)
      }
    }

    loadReviews()
  }, [listingId, refreshKey])

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 5)

  if (reviews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No reviews yet</p>
      </div>
    )
  }

  const ReviewItem = ({ review, isReply = false }: { review: Review, isReply?: boolean }) => (
    <div className={cn("space-y-2", isReply && "ml-8 mt-4")}>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={review.reviewer.avatar_url || undefined} />
          <AvatarFallback>
            {review.reviewer.full_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{review.reviewer.full_name}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(review.created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>
      
      {review.rating > 0 && !isReply && (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              size={16}
            />
          ))}
        </div>
      )}
      
      <p className="text-sm">{review.comment}</p>

      {!isReply && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Reply
        </Button>
      )}

      {replyingTo === review.id && (
        <div className="mt-4">
          <ReviewForm
            listingId={listingId}
            parentId={review.id}
            onReviewSubmitted={(newReply) => {
              setReviews(prev => prev.map(r => 
                r.id === review.id 
                  ? { 
                      ...r, 
                      replies: [...(r.replies || []), {
                        ...newReply,
                        parent_id: review.id,
                        is_reply: true
                      }]
                    }
                  : r
              ))
              setReplyingTo(null)
            }}
          />
        </div>
      )}

      {review.replies?.map(reply => (
        <ReviewItem key={reply.id} review={reply} isReply={true} />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {visibleReviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}

      {reviews.length > 5 && !showAllReviews && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowAllReviews(true)}
        >
          View All Reviews ({reviews.length})
        </Button>
      )}
    </div>
  )
} 

"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { ReviewForm } from "./review-form"
import { ReviewsList } from "./reviews-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/lib/supabase/types"

type Review = {
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

interface RatingSummaryProps {
  reviews: Review[]
}

function RatingSummary({ reviews }: RatingSummaryProps) {
  if (reviews.length === 0) return null

  // Only count non-reply reviews for the rating summary
  const mainReviews = reviews.filter(review => !review.is_reply)
  const totalRating = mainReviews.reduce((acc, review) => acc + review.rating, 0)
  const averageRating = mainReviews.length > 0 ? totalRating / mainReviews.length : 0
  
  // Calculate rating distribution
  const distribution = Array(5).fill(0)
  mainReviews.forEach(review => {
    if (review.rating > 0) {
      distribution[review.rating - 1]++
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex gap-0.5 justify-center mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  size={16}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {mainReviews.length} {mainReviews.length === 1 ? "review" : "reviews"}
            </div>
          </div>
          
          <div className="flex-1">
            {distribution.map((count, index) => {
              const percentage = mainReviews.length > 0 ? (count / mainReviews.length) * 100 : 0
              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-12">{5 - index} stars</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-8 text-right text-muted-foreground">{count}</div>
                </div>
              )
            }).reverse()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ReviewsSectionProps {
  listingId: string
  onReviewSubmitted?: (review: Review) => void
}

export function ReviewsSection({ listingId, onReviewSubmitted }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const handleNewReview = (newReview: Review) => {
    // Update reviews state with the new review
    setReviews(prev => [newReview, ...prev.filter(r => !r.parent_id)])
    // Increment refresh key to trigger a reload
    setRefreshKey(prev => prev + 1)
    // Notify parent component
    onReviewSubmitted?.(newReview)
  }

  const handleReviewsUpdate = (updatedReviews: Review[]) => {
    setReviews(updatedReviews)
  }

  return (
    <div className="space-y-8">
      <RatingSummary reviews={reviews} />
      <ReviewForm
        listingId={listingId}
        onReviewSubmitted={handleNewReview}
      />
      <ReviewsList
        listingId={listingId}
        onReviewsUpdated={handleReviewsUpdate}
        refreshKey={refreshKey}
      />
    </div>
  )
} 

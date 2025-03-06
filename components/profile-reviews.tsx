"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  reviewer: {
    username: string
    full_name: string
    avatar_url: string | null
  }
  listing: {
    id: string
    title: string
    images: string[] | null
  }
}

interface ProfileReviewsProps {
  userId: string
}

export function ProfileReviews({ userId }: ProfileReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            reviewer:profiles!reviews_reviewer_id_fkey(
              username,
              full_name,
              avatar_url
            ),
            listing:listings!reviews_listing_id_fkey(
              id,
              title,
              images,
              seller_id
            )
          `)
          .eq('listing.seller_id', userId)
          .order('created_at', { ascending: false })

        if (reviewsError) {
          console.error('Supabase error details:', reviewsError)
          throw reviewsError
        }
        
        if (!reviewsData) {
          console.error('No data returned from query')
          throw new Error('No data returned from query')
        }
        
        console.log('Fetched reviews:', reviewsData)
        setReviews(reviewsData)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError(err instanceof Error ? err.message : 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [userId, supabase])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (reviews.length === 0) {
    return <div className="text-muted-foreground">No reviews yet</div>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={review.reviewer.avatar_url || undefined} />
                <AvatarFallback>
                  {review.reviewer.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.reviewer.full_name}</p>
                <p className="text-sm text-muted-foreground">@{review.reviewer.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-sm">{review.comment}</p>
          
          <div className="flex items-center justify-between text-sm">
            {review.listing ? (
              <Link 
                href={`/listings/${review.listing.id}`}
                className="text-muted-foreground hover:text-foreground"
              >
                Review for: {review.listing.title}
              </Link>
            ) : (
              <span className="text-muted-foreground">Listing no longer available</span>
            )}
            <span className="text-muted-foreground">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 

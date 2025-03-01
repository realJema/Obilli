"use client"

import { useState } from "react"
import { Star, StarHalf } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/lib/supabase/types"

interface ReviewFormProps {
  listingId: string
  parentId?: string
  onReviewSubmitted?: (review: {
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
  }) => void
}

export function ReviewForm({ listingId, parentId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()
  
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to leave a review",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data: reviewData, error } = await supabase
        .from("reviews")
        .insert({
          listing_id: listingId,
          reviewer_id: user.id,
          rating: parentId ? 0 : (rating || 0), // No rating for replies
          comment: comment.trim(),
          helpful_count: 0,
          parent_id: parentId || null,
          is_reply: !!parentId
        })
        .select(`
          id,
          listing_id,
          reviewer_id,
          rating,
          comment,
          helpful_count,
          created_at,
          parent_id,
          is_reply
        `)
        .single()

      if (error) throw error

      // Get reviewer data
      const { data: reviewerData, error: reviewerError } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url")
        .eq("id", user.id)
        .single()

      if (reviewerError) throw reviewerError

      const review = {
        ...reviewData,
        reviewer: reviewerData
      } as Database["public"]["Tables"]["reviews"]["Row"] & {
        reviewer: {
          username: string
          full_name: string
          avatar_url: string | null
        }
      }

      toast({
        title: "Success",
        description: parentId ? "Your reply has been submitted" : "Your review has been submitted",
      })

      // Reset form
      setRating(0)
      setComment("")
      
      // Notify parent component with the new review data
      onReviewSubmitted?.(review)
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Please sign in to leave a review</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!parentId && ( // Only show rating for main reviews, not replies
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating (optional)</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value === rating ? 0 : value)}
                className="text-2xl focus:outline-none"
              >
                <Star
                  className={value <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          {parentId ? "Your Reply" : "Your Review"}
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={parentId ? "Write your reply here..." : "Write your review here..."}
          className="min-h-[100px]"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || !comment.trim()}
      >
        {isSubmitting ? "Submitting..." : (parentId ? "Submit Reply" : "Submit Review")}
      </Button>
    </form>
  )
} 

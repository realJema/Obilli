import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Metadata } from "next"
import { constructProfileMetadata } from "@/lib/metadata"

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  
  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("username", params.username)
    .single()

  if (!profile) {
    return constructProfileMetadata({
      username: params.username,
      fullName: "User Not Found",
      totalListings: 0,
      rating: 0
    })
  }

  // Get total listings count
  const { count: totalListings } = await supabase
    .from("listings")
    .select("*", { count: "exact" })
    .eq("seller_id", profile.id)

  // Get average rating
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("seller_id", profile.id)

  const averageRating = reviews?.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  return constructProfileMetadata({
    username: profile.username,
    fullName: profile.full_name,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    totalListings: totalListings || 0,
    rating: averageRating,
    location: profile.location
  })
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 

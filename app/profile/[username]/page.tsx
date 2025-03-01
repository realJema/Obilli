import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, MapPin, Calendar } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListingCard } from "@/components/listing-card"

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("username", params.username)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch user's listings
  const { data: listings } = await supabase
    .from("listings")
    .select(`
      *,
      category:categories(name, slug),
      seller:profiles!seller_id(username, full_name, avatar_url)
    `)
    .eq("seller_id", profile.id)
    .order("created_at", { ascending: false })

  // Fetch user's reviews (as a seller)
  const { data: reviews, count: reviewCount } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:profiles!reviewer_id(username, full_name, avatar_url),
      listing:listings(title)
    `, { count: 'exact' })
    .eq("seller_id", profile.id)
    .order("created_at", { ascending: false })

  // Calculate average rating
  const averageRating = reviews?.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={profile.avatar_url || `/placeholder.svg?text=${profile.full_name.charAt(0)}`}
              alt={profile.full_name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>
          {profile.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {profile.location}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Joined {format(new Date(profile.created_at), "MMMM yyyy")}
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-2xl font-bold">{listings?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Listings</div>
            </div>
            <div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              </div>
              <div className="text-sm text-muted-foreground">{reviewCount || 0} reviews</div>
            </div>
          </div>
          {profile.bio && <p className="text-sm">{profile.bio}</p>}
          <Button className="w-full">Contact</Button>
        </div>

        <div>
          <Tabs defaultValue="listings">
            <TabsList>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="listings" className="mt-6">
              {listings?.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No listings yet
                </div>
              )}
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              {reviews?.length ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={review.reviewer.avatar_url || `/placeholder.svg?text=${review.reviewer.full_name.charAt(0)}`}
                            alt={review.reviewer.full_name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium">{review.reviewer.full_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(review.created_at), "PP")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      <div className="text-sm text-muted-foreground">
                        On listing: {review.listing.title}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No reviews yet
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


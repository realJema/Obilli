"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Calendar, Phone } from "lucide-react"
import { format } from "date-fns"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listing-card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Add shimmer loading animation styles
const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"

interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  phone_number: string | null
  bio: string | null
  location: string | null
  created_at: string
}

interface Listing {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  created_at: string
  seller: Profile
  rating: number
  total_reviews: number
  location_id: string
  address: string
  category: {
    id: string
    name: string
    slug: string
  }
  condition: string
  location: {
    id: string
    name: string
    slug: string
    parent_id: string | null
    type: 'town' | 'quarter'
    parent?: {
      id: string
      name: string
      slug: string
      type: 'town'
    }
  }
}

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  reviewer: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
  }
  listing: {
    id: string
    title: string
  }
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [listings, setListings] = useState<any[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [listingsLoading, setListingsLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalListings, setTotalListings] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const itemsPerPage = 12

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', params.username)
          .single()

        if (profileError) {
          throw new Error('Profile not found')
        }

        setProfile(profileData)
        
        // Check if this is the user's own profile
        if (session) {
          setIsOwnProfile(session.user.id === profileData.id)
        }

        // Get total listings count
        const { count } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', profileData.id)

        setTotalListings(count || 0)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.username, supabase])

  // Fetch listings separately
  useEffect(() => {
    const fetchListings = async () => {
      if (!profile?.id) return

      try {
        setListingsLoading(true)
        const { data: listingsData, error: listingsError } = await supabase
          .from('listings')
          .select(`
            *,
            location:locations2!inner(
              id,
              name,
              slug,
              parent_id,
              type
            )
          `)
          .eq('seller_id', profile.id)
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

        if (listingsError) throw listingsError

        // After getting the listings, fetch parent locations separately
        const listingsWithParentLocations = await Promise.all(
          listingsData.map(async (listing) => {
            let parentLocation = null
            if (listing.location?.parent_id) {
              const { data: parent } = await supabase
                .from('locations2')
                .select('id, name, slug, type')
                .eq('id', listing.location.parent_id)
                .single()
              parentLocation = parent
            }

            return {
              ...listing,
              location: {
                ...listing.location,
                parent: parentLocation
              }
            }
          })
        )

        setListings(listingsWithParentLocations)
      } catch (err) {
        console.error('Error fetching listings:', err)
      } finally {
        setListingsLoading(false)
      }
    }

    fetchListings()
  }, [profile?.id, currentPage, supabase])

  // Fetch reviews separately
  useEffect(() => {
    const fetchReviews = async () => {
      if (!profile?.id) return

      try {
        setReviewsLoading(true)
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            reviewer:profiles!reviewer_id(
              id,
              username,
              full_name,
              avatar_url
            ),
            listing:listings!listing_id(
              id,
              title
            )
          `)
          .eq('seller_id', profile.id)
          .order('created_at', { ascending: false })

        if (reviewsError) throw reviewsError

        setReviews(reviewsData || [])
        
        // Calculate average rating
        if (reviewsData?.length) {
          const avgRating = reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length
          setAverageRating(avgRating)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [profile?.id, supabase])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || "The profile you're looking for doesn't exist."}</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    )
  }

  const totalPages = Math.ceil(totalListings / itemsPerPage)

  return (
    <div className="container py-4 md:py-8">
      <div className="grid gap-6 md:gap-8 md:grid-cols-[280px_1fr]">
        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex md:block items-center gap-4 md:gap-0">
            <div className="relative h-20 w-20 md:h-auto md:w-full md:aspect-square overflow-hidden rounded-full md:rounded-lg flex-shrink-0">
              <Image
                src={profile.avatar_url || `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>')}`}
                alt={profile.full_name}
                fill
                className="object-cover bg-muted"
                priority
              />
            </div>
            
            <div className="md:mt-4 md:text-center">
              <h1 className="text-xl md:text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {profile.bio && (
              <p className="text-sm text-muted-foreground md:text-center">{profile.bio}</p>
            )}

            <div className="space-y-2 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{profile.location}</span>
                </div>
              )}
              
              {profile.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{profile.phone_number}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Joined {format(new Date(profile.created_at), "MMMM yyyy")}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{totalListings}</div>
                <div className="text-xs text-muted-foreground">Listings</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                  <span className="text-xl md:text-2xl font-bold">{averageRating.toFixed(1)}</span>
                </div>
                <div className="text-xs text-muted-foreground">{reviews.length} reviews</div>
              </div>
            </div>

            {isOwnProfile ? (
              <Button 
                className="w-full" 
                variant="outline"
                asChild
              >
                <Link href="/profile/settings">
                  Edit Profile
                </Link>
              </Button>
            ) : (
              <Button className="w-full">
                Contact
              </Button>
            )}
          </div>
        </div>

        <div>
          <Tabs defaultValue="listings" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="listings" className="flex-1">Listings ({totalListings})</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="listings">
              {listingsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No listings yet</p>
                </div>
              ) : (
                <>
                  <div key={currentPage} className="animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {listings.map((listing) => (
                        <ListingCard 
                          key={listing.id} 
                          listing={listing} 
                          variant="compact"
                        />
                      ))}
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-8 px-2"
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1 md:gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                            className="h-8 w-8"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 px-2"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              {reviewsLoading ? (
                <div className="space-y-3">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3 p-3 md:p-4 rounded-lg border">
                      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-lg border">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={review.reviewer.avatar_url || `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>')}`}
                          alt={review.reviewer.full_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 md:mb-2">
                          <div className="min-w-0">
                            <p className="font-medium truncate">{review.reviewer.full_name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {format(new Date(review.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center flex-shrink-0 ml-2">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="ml-1 font-medium">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-sm line-clamp-3">{review.comment}</p>
                        {review.listing && (
                          <Link 
                            href={`/listings/${review.listing.id}`}
                            className="text-xs md:text-sm text-muted-foreground hover:text-primary mt-2 inline-block truncate"
                          >
                            Review for: {review.listing.title}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


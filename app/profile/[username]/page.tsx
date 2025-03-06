import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Calendar } from "lucide-react"
import { format } from "date-fns"
import { Metadata } from "next"
import { constructProfileMetadata } from "@/lib/metadata"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListingCard } from "@/components/listing-card"
import { ProfileListingCard } from "@/components/profile-listing-card"
import { ProfileReviews } from "@/components/profile-reviews"

const ITEMS_PER_PAGE = 9

// Loading skeleton for listings
function ListingsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <div className="aspect-[4/3] w-full bg-muted animate-pulse rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

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

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: { username: string }
  searchParams: { page?: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const currentPage = Number(searchParams.page) || 1
  const from = (currentPage - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  // Get current user session
  const { data: { session } } = await supabase.auth.getSession()

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("username", params.username)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch user's listings with pagination
  const { data: listings, count: totalListings } = await supabase
    .from("listings")
    .select(`
      *,
      category:categories(name, slug),
      seller:profiles!seller_id(username, full_name, avatar_url),
      location:locations!listings_location_id_fkey(
        id,
        name,
        slug,
        parent_id,
        type
      )
    `, { count: 'exact' })
    .eq("seller_id", profile.id)
    .order("created_at", { ascending: false })
    .range(from, to)

  // Helper function to get parent location
  const getParentLocation = async (parentId: string) => {
    const { data } = await supabase
      .from('locations')
      .select('id, name, slug, type')
      .eq('id', parentId)
      .single()
    return data
  }

  // Get parent locations for each listing
  const listingsWithParentLocations = listings ? await Promise.all(
    listings.map(async (listing) => {
      if (listing.location?.parent_id) {
        const parentLocation = await getParentLocation(listing.location.parent_id)
        return {
          ...listing,
          location: {
            ...listing.location,
            parent: parentLocation
          }
        }
      }
      return listing
    })
  ) : []

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

  const totalPages = totalListings ? Math.ceil(totalListings / ITEMS_PER_PAGE) : 1

  // Check if viewing own profile
  const isOwnProfile = session?.user.id === profile.id

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
              <div className="text-2xl font-bold">{totalListings || 0}</div>
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
          <Tabs defaultValue="listings" className="mt-6">
            <TabsList>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listings" className="mt-6">
              {listings?.length ? (
                <>
                  <div key={currentPage} className="animate-fadeIn">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {listingsWithParentLocations.map((listing) => (
                        isOwnProfile ? (
                          <ProfileListingCard key={listing.id} listing={listing} variant="compact" />
                        ) : (
                          <ListingCard key={listing.id} listing={listing} variant="compact" />
                        )
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center gap-2">
                        {currentPage > 1 && (
                          <Button
                            variant="outline"
                            asChild
                          >
                            <Link 
                              href={`/profile/${params.username}?page=${currentPage - 1}`}
                              scroll={false}
                            >
                              Previous
                            </Link>
                          </Button>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="icon"
                              asChild
                            >
                              <Link 
                                href={`/profile/${params.username}?page=${page}`}
                                scroll={false}
                                className="w-8 h-8 flex items-center justify-center"
                              >
                                {page}
                              </Link>
                            </Button>
                          ))}
                        </div>

                        {currentPage < totalPages && (
                          <Button
                            variant="outline"
                            asChild
                          >
                            <Link 
                              href={`/profile/${params.username}?page=${currentPage + 1}`}
                              scroll={false}
                            >
                              Next
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  No listings yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProfileReviews userId={profile.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


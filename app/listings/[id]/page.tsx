"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, ZoomIn, X } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import type { Database } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"
import { ReviewsSection } from "@/app/components/reviews"
import { ListingCard } from "@/components/listing-card"
import ListingDetailsLoading from "./loading"
import { ContactButtons } from "@/components/contact-buttons"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  reviewer: {
    username: string
    full_name: string
    avatar_url: string | null
  }
}

type Location = {
  id: string
  name: string
  slug: string
  parent_id: string | null
  type: "town"
  parent?: {
    id: string
    name: string
    slug: string
    type: "town"
  }
}

type Listing = Database["public"]["Tables"]["listings"]["Row"] & {
  seller: {
    username: string
    full_name: string
    avatar_url: string | null
    phone_number: string | null
    email: string | null
  }
  category: {
    name: string
    slug: string
    parent: {
      name: string
      slug: string
      parent: {
        name: string
        slug: string
      } | null
    } | null
  }
  location: Location
  rating: number
  total_reviews: number
}

// Add shimmer loading animation styles
const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"

export default function ListingDetailsPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [similarListings, setSimilarListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [displayedImage, setDisplayedImage] = useState<string | null>(null)

  // Add retry logic helper
  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error: any) {
        if (error?.status === 429) { // Rate limit error
          const delay = Math.min(1000 * Math.pow(2, i), 10000) // Exponential backoff: 1s, 2s, 4s, up to 10s
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw error
      }
    }
    throw new Error('Max retries reached')
  }

  useEffect(() => {
    let mounted = true

    async function fetchListingData() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClientComponentClient<Database>()

        // Fetch the listing with all its relations
        const { data: listingData, error: listingError } = await retryWithBackoff(async () => 
          await supabase
            .from("listings")
            .select(`
              *,
              seller:profiles!listings_seller_id_fkey(
                username,
                full_name,
                avatar_url,
                phone_number
              ),
              category:categories!listings_category_id_fkey(
                name,
                slug,
                parent:categories!parent_id(
                  name,
                  slug,
                  parent:categories!parent_id(
                    name,
                    slug
                  )
                )
              ),
              location:locations2!listings_location_id_fkey(
                id,
                name,
                slug,
                parent_id,
                type
              )
            `)
            .eq("id", params.id)
            .single()
        )

        if (listingError) {
          console.error("Error fetching listing:", listingError)
          throw new Error(listingError.message)
        }

        if (!listingData) {
          throw new Error("Listing not found")
        }

        // Fetch reviews with retry logic
        const { data: reviewsData } = await retryWithBackoff(async () =>
          await supabase
            .from("reviews")
            .select(`
              *,
              reviewer:profiles(
                username,
                full_name,
                avatar_url
              )
            `)
            .eq("listing_id", params.id)
            .order("created_at", { ascending: false })
        )

        // Get category hierarchy with retry logic
        const getCategoryHierarchy = async (categoryId: string) => {
          return await retryWithBackoff(async () => {
            // First get the subcategory (current category)
            const { data: subcategory } = await supabase
              .from("categories")
              .select("*")
              .eq("id", categoryId)
              .single()

            if (!subcategory) return null;

            // Get the subgroup (parent of subcategory)
            const { data: subgroup } = await supabase
              .from("categories")
              .select("*")
              .eq("id", subcategory.parent_id)
              .single()

            if (!subgroup) {
              return {
                name: subcategory.name,
                slug: subcategory.slug,
                parent: null
              }
            }

            // Get the main category (parent of subgroup)
            const { data: mainCategory } = await supabase
              .from("categories")
              .select("*")
              .eq("id", subgroup.parent_id)
              .single()

            return {
              name: subcategory.name,
              slug: subcategory.slug,
              parent: {
                name: subgroup.name,
                slug: subgroup.slug,
                parent: mainCategory ? {
                  name: mainCategory.name,
                  slug: mainCategory.slug
                } : null
              }
            }
          })
        }

        const categoryHierarchy = await getCategoryHierarchy(listingData.category_id)

        // Update listing with parent location and category hierarchy with retry logic
        let listingWithParentLocation = {
          ...listingData,
          location: {
            ...listingData.location,
            parent: listingData.location?.parent_id
              ? (await retryWithBackoff(async () => 
                  (await supabase
                    .from('locations2')
                    .select('id, name, slug, type')
                    .eq('id', listingData.location.parent_id)
                    .single())
                )).data
              : null
          },
          category: categoryHierarchy,
          rating: 0,
          total_reviews: reviewsData?.length || 0
        } as Listing

        if (mounted) {
          setListing(listingWithParentLocation)
          setReviews(reviewsData || [])

          // Fetch similar listings with retry logic
          const { data: similarData } = await retryWithBackoff(async () =>
            await supabase
              .from("listings")
              .select(`
                *,
                seller:profiles(
                  username,
                  full_name,
                  avatar_url
                ),
                location:locations!listings_location_id_fkey(
                  id,
                  name,
                  slug,
                  parent_id,
                  type
                ),
                reviews:reviews(rating)
              `)
              .eq("category_id", listingData.category_id)
              .neq("id", listingData.id)
              .limit(5)
          )

          if (similarData) {
            const processedSimilar = similarData.map(listing => ({
              ...listing,
              rating: listing.reviews?.length 
                ? listing.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / listing.reviews.length 
                : 0,
              total_reviews: listing.reviews?.length || 0
            }))
            setSimilarListings(processedSimilar as Listing[])
          }
        }
      } catch (err) {
        console.error("Error in fetchListingData:", err)
        if (mounted) {
        setError(err instanceof Error ? err.message : "Failed to load listing")
          setListing(null)
        }
      } finally {
        if (mounted) {
        setLoading(false)
        }
      }
    }

    fetchListingData()

    return () => {
      mounted = false
    }
  }, [params.id])

  // Update selected image when listing changes
  useEffect(() => {
    if (listing && Array.isArray(listing.images) && listing.images.length > 0) {
      // Just update the displayed image, don't open lightbox
      setDisplayedImage(listing.images[0])
    }
  }, [listing])

  if (loading) {
    return <ListingDetailsLoading />
  }

  if (error || !listing) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || "The listing you're looking for doesn't exist or has been removed."}</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    )
  }

  // Calculate average rating
  const rating = reviews.length 
    ? reviews.reduce((acc: number, rev: Review) => acc + rev.rating, 0) / reviews.length 
    : 0

  const getLocationString = (location: Listing["location"] | null) => {
    if (!location) return "Location not specified"
    if (location.parent) {
      return `${location.parent.name}, ${location.name}`
    }
    return location.name || "Location not specified"
  }

  const breadcrumbItems = [
    // Add main category if exists
    ...(listing.category?.parent?.parent ? [{
      label: listing.category.parent.parent.name,
      href: `/filter?category=${listing.category.parent.parent.slug}`,
    }] : []),
    // Add subgroup
    ...(listing.category?.parent ? [{
      label: listing.category.parent.name,
      href: `/filter?category=${listing.category.parent.slug}`,
    }] : []),
    // Add subcategory
    ...(listing.category ? [{
      label: listing.category.name,
      href: `/filter?category=${listing.category.slug}`,
    }] : []),
    {
      label: listing.title,
      href: `/listings/${listing.id}`,
    }
  ]

  return (
    <>
      <div className="container py-8">
        <button 
          onClick={() => window.history.back()} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div>
            <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={listing.seller.avatar_url || undefined}
                    alt={listing.seller.full_name}
                  />
                  <AvatarFallback>{listing.seller.full_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{listing.seller.full_name}</p>
                  <p className="text-sm text-muted-foreground">@{listing.seller.username}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
              </div>
            </div>

            {/* Main Image */}
            <div 
              className={cn(
                "aspect-video relative mb-4 cursor-zoom-in overflow-hidden rounded-lg",
                shimmer
              )}
              onClick={() => setSelectedImage(displayedImage || listing.images?.[0] || "")}
            >
              <Image
                src={displayedImage || listing.images?.[0] || "/placeholder.svg"}
                alt={listing.title}
                fill
                className="object-cover rounded-lg transition-opacity duration-700 opacity-0 data-[loaded=true]:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement
                  target.dataset.loaded = "true"
                  target.classList.add('opacity-100')
                }}
                data-loaded="false"
              />
            </div>

            {/* Thumbnail Gallery */}
            {listing.images && listing.images.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mb-6">
                {listing.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    className={cn(
                      "aspect-square relative rounded-lg overflow-hidden cursor-pointer transition-opacity",
                      displayedImage === image ? "ring-2 ring-primary" : "hover:opacity-80",
                      shimmer
                    )}
                    onClick={() => setDisplayedImage(image)}
                  >
                    <Image 
                      src={image} 
                      alt={`${listing.title} - Image ${index + 1}`} 
                      fill 
                      className="object-cover transition-opacity duration-700 opacity-0 data-[loaded=true]:opacity-100"
                      loading="lazy"
                      sizes="(max-width: 768px) 20vw, 10vw"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement
                        target.dataset.loaded = "true"
                        target.classList.add('opacity-100')
                      }}
                      data-loaded="false"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div className="text-base space-y-4 whitespace-pre-line">{listing.description}</div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection 
              listingId={listing.id} 
              onReviewSubmitted={(newReview) => {
                setReviews(prev => [newReview, ...prev])
                const newRating = (rating * reviews.length + newReview.rating) / (reviews.length + 1)
                const ratingElement = document.querySelector('.rating-value')
                if (ratingElement) {
                  ratingElement.textContent = newRating.toFixed(1)
                }
              }}
            />
          </div>

          {/* Right Column - Fixed Position */}
          <div className="md:sticky md:top-8 h-fit">
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <p className="text-3xl font-bold mb-4">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'XAF',
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0
                  }).format(listing.price)}
                </p>
                {rating > 0 && (
                  <div className="flex items-center mb-4">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">({reviews.length} reviews)</span>
                  </div>
                )}

                {/* Details Section */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">
                      {listing.category.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Condition</p>
                    <p className="font-medium">{listing.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{getLocationString(listing.location)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{listing.address}</p>
                  </div>
                </div>
              </div>

              <ContactButtons 
                phoneNumber={listing.seller.phone_number}
                email={listing.seller.email}
                listingTitle={listing.title}
              />

              <div className="border-t pt-6">
                <ul className="space-y-2 text-sm">
                  <li>• Secure payments through our platform</li>
                  <li>• 24/7 customer support</li>
                  <li>• Money-back guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings - Full Width Section */}
      {similarListings.length > 0 && (
        <div className="border-t mt-16">
        <div className="container py-12">
            <h3 className="text-xl font-semibold mb-6">Similar Listings</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similarListings.map((similar) => (
                <ListingCard 
                  key={similar.id}
                  listing={similar}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full">
            <Image
              src={selectedImage}
              alt={listing.title}
              fill
              className="object-contain"
              loading="lazy"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0fHRsdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedImage(null)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}












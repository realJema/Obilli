"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import type { Database } from "@/lib/supabase/types"
import { cn } from "@/lib/utils"
import { ReviewsSection } from "@/app/components/reviews"

type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  reviewer: {
    username: string
    full_name: string
    avatar_url: string | null
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
  location: {
    name: string
    type: string
    parent: {
      name: string
      type: string
    } | null
  }
}

export default function ListingDetailsPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [similarListings, setSimilarListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchListingData() {
      try {
        setLoading(true)
        const supabase = createClientComponentClient<Database>()

        // Fetch listing details with related data
        const { data: listingData, error: listingError } = await supabase
          .from("listings")
          .select(`
            *,
            seller:profiles(
              username,
              full_name,
              avatar_url
            ),
            location:locations!listings_location_id_fkey(
              name,
              type,
              parent:locations(
                name,
                type
              )
            )
          `)
          .eq("id", params.id)
          .single()

        if (listingError) throw listingError

        // Get category data
        const { data: categoryData } = await supabase
          .from("categories")
          .select("*")
          .eq("id", listingData.category_id)
          .single()

        if (categoryData) {
          const parentCategory = categoryData.parent_id ? 
            (await supabase
              .from("categories")
              .select("*")
              .eq("id", categoryData.parent_id)
              .single()).data : null

          // Fetch main category (parent of parent)
          const mainCategory = parentCategory?.parent_id ?
            (await supabase
              .from("categories")
              .select("*")
              .eq("id", parentCategory.parent_id)
              .single()).data : null

          listingData.category = {
            name: categoryData.name,
            slug: categoryData.slug,
            parent: parentCategory ? {
              name: parentCategory.name,
              slug: parentCategory.slug,
              parent: mainCategory ? {
                name: mainCategory.name,
                slug: mainCategory.slug
              } : null
            } : null
          }
        }

        setListing(listingData as Listing)

        // Fetch reviews
        const { data: reviewsData } = await supabase
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

        setReviews(reviewsData as Review[] || [])

        // Fetch similar listings
        if (listingData) {
          const { data: similarData } = await supabase
            .from("listings")
            .select(`
              *,
              seller:profiles(
                username,
                full_name,
                avatar_url
              ),
              location:locations!listings_location_id_fkey(
                name,
                type,
                parent:locations(
                  name,
                  type
                )
              )
            `)
            .eq("category_id", listingData.category_id)
            .neq("id", listingData.id)
            .limit(5)

          if (similarData) {
            // Add category data to similar listings
            const similarWithCategories = await Promise.all(similarData.map(async (similar) => {
              const { data: similarCategory } = await supabase
                .from("categories")
                .select("*")
                .eq("id", similar.category_id)
                .single()

              if (similarCategory) {
                const parentCategory = similarCategory.parent_id ?
                  (await supabase
                    .from("categories")
                    .select("*")
                    .eq("id", similarCategory.parent_id)
                    .single()).data : null

                return {
                  ...similar,
                  category: {
                    name: similarCategory.name,
                    slug: similarCategory.slug,
                    parent: parentCategory ? {
                      name: parentCategory.name,
                      slug: parentCategory.slug
                    } : null
                  }
                }
              }
              return similar
            }))

            setSimilarListings(similarWithCategories as Listing[])
          }
        }
      } catch (err) {
        console.error("Error in fetchListingData:", err)
        setError(err instanceof Error ? err.message : "Failed to load listing")
      } finally {
        setLoading(false)
      }
    }

    fetchListingData()
  }, [params.id])

  // Update selected image when listing changes
  useEffect(() => {
    if (listing && Array.isArray(listing.images) && listing.images.length > 0) {
      setSelectedImage(listing.images[0])
    }
  }, [listing])

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading listing details...</p>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
        <p className="text-muted-foreground mb-8">The listing you're looking for doesn't exist or has been removed.</p>
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
    return location.parent 
      ? `${location.parent.name}, ${location.name}`
      : location.name
  }

  const breadcrumbItems = [
    {
      label: listing.category.parent?.parent?.name || "Categories",
      href: `/filter?category=${listing.category.parent?.parent?.slug || ""}`,
    },
    {
      label: listing.category.parent?.name || "All Categories",
      href: `/filter?category=${listing.category.parent?.slug || ""}`,
    },
    {
      label: listing.category.name,
      href: `/filter?category=${listing.category.slug}`,
    },
    {
      label: listing.title,
      href: `/listings/${listing.id}`,
    },
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
                <Image
                  src={listing.seller.avatar_url || "/placeholder.svg"}
                  alt={listing.seller.full_name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
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
            <div className="aspect-video relative mb-4">
              <Image
                src={selectedImage || listing.images?.[0] || "/placeholder.svg"}
                alt={listing.title}
                fill
                className="object-cover rounded-lg"
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
                      selectedImage === image ? "ring-2 ring-primary" : "hover:opacity-80"
                    )}
                  onClick={() => setSelectedImage(image)}
                  >
                    <Image 
                      src={image} 
                      alt={`${listing.title} - Image ${index + 1}`} 
                      fill 
                      className="object-cover" 
                    />
                </button>
              ))}
            </div>
            )}

            {/* Description Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div className="text-sm space-y-4 whitespace-pre-line">{listing.description}</div>
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
                      {listing.category.parent ? `${listing.category.parent.name} › ` : ''}
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

              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  <Link 
                    href={listing.seller.phone_number 
                      ? `https://wa.me/${listing.seller.phone_number}?text=Hi, I'm interested in your listing: ${listing.title}`
                      : "#"}
                    target="_blank"
                    onClick={(e) => {
                      if (!listing.seller.phone_number) {
                        e.preventDefault()
                        alert("Seller's phone number is not available")
                      }
                    }}
                  >
                    Contact on WhatsApp
                  </Link>
                </Button>
                <Button 
                  className="w-full" 
                  size="lg" 
                  variant="outline"
                  asChild
                >
                  <Link 
                    href={listing.seller.email
                      ? `mailto:${listing.seller.email}?subject=Regarding your listing: ${listing.title}`
                      : "#"}
                    onClick={(e) => {
                      if (!listing.seller.email) {
                        e.preventDefault()
                        alert("Seller's email is not available")
                      }
                    }}
                  >
                    Send Email
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>• Secure payments through our platform</p>
                <p>• 24/7 customer support</p>
                <p>• Money-back guarantee</p>
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
              {similarListings.map((similar: Listing) => (
                <Link
                  key={similar.id}
                  href={`/listings/${similar.id}`}
                  className="block group"
                >
                  <div className="h-[280px] flex flex-col bg-white rounded-lg overflow-hidden border">
                    <div className="h-[160px] relative">
                      <Image
                        src={similar.images?.[0] || "/placeholder.svg"}
                        alt={similar.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="h-[120px] p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium group-hover:text-primary truncate">
                          {similar.title}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {getLocationString(similar.location)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {new Intl.NumberFormat('fr-FR', { 
                          style: 'currency', 
                          currency: 'XAF',
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0
                        }).format(similar.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}












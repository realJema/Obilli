"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Seller {
  username: string
  full_name: string
  avatar_url: string | null
}

interface Category {
  name: string
  slug: string
}

interface Location {
  id: string
  name: string
  slug: string
  parent_id: string | null
  type: 'town' | 'quarter'
}

interface Listing {
  id: string
  title: string
  description: string
  seller: Seller | null
  location_id: string
  address: string
  location?: Location
  price: number
  rating: number
  total_reviews: number
  images: string[] | null
  category: Category
}

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  // Helper functions
  const getListingImage = () => {
    if (!listing.images || !Array.isArray(listing.images) || listing.images.length === 0) {
      return "/placeholder.svg"
    }
    return listing.images[0]
  }

  const getSellerInitials = () => {
    if (!listing.seller?.full_name) return "U"
    return listing.seller.full_name.charAt(0).toUpperCase()
  }

  const getSellerDisplayName = () => {
    return listing.seller?.full_name || "Anonymous User"
  }

  const getSellerUsername = () => {
    return listing.seller?.username || "anonymous"
  }

  const getLocationDisplay = () => {
    if (listing.location) {
      return listing.location.name
    }
    return listing.address || "Location not specified"
  }

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block group"
    >
      <div className="border rounded-lg overflow-hidden transition-colors hover:border-green-600 h-[300px] flex flex-col">
        <div className="h-[160px] relative">
          <Image
            src={getListingImage()}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="h-[140px] p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center flex-1 min-w-0">
              <Avatar className="h-6 w-6 mr-2 flex-shrink-0">
                <AvatarImage
                  src={listing.seller?.avatar_url || undefined}
                  alt={getSellerDisplayName()}
                />
                <AvatarFallback>{getSellerInitials()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{getSellerDisplayName()}</p>
                <p className="text-xs text-muted-foreground truncate">@{getSellerUsername()}</p>
              </div>
            </div>
          </div>
          <h3 className="font-semibold truncate group-hover:text-green-600">{listing.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground truncate mt-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            {getLocationDisplay()}
          </div>
          <div className="mt-auto pt-2 flex items-end justify-between">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm font-semibold">
                {typeof listing.rating === "number" ? listing.rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm text-muted-foreground ml-1">({listing.total_reviews || 0})</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">From</p>
              <p className="font-semibold">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0
                }).format(listing.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 

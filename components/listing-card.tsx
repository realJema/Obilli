"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

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
  parent?: {
    id: string
    name: string
    slug: string
    type: 'town'
  }
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
  created_at: string
  condition: string
}

interface ListingCardProps {
  listing: Listing
  variant?: 'default' | 'compact'
}

// Add shimmer loading animation styles
const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"

export function ListingCard({ listing, variant = 'default' }: ListingCardProps) {
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
    if (!listing.location) return "Location not specified"
    
    // If location has a parent (quarter in a town), show both
    if (listing.location.type === 'quarter' && listing.location.parent) {
      return `${listing.location.name}, ${listing.location.parent.name}`
    }
    
    // Otherwise just show the location name
    return listing.location.name
  }

  const imageHeight = variant === 'compact' ? 'h-[180px]' : 'h-[200px]'
  const cardHeight = variant === 'compact' ? 'h-[420px]' : 'h-[440px]'

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block group h-full"
    >
      <div className="border rounded-lg overflow-hidden transition-colors hover:border-green-600 flex flex-col h-full">
        <div className={cn(
          "aspect-[16/9] relative bg-muted w-full overflow-hidden",
          shimmer
        )}>
          <Image
            src={getListingImage()}
            alt={listing.title}
            fill
            className="object-cover transition-opacity duration-700 opacity-0 data-[loaded=true]:opacity-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
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
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center flex-1 min-w-0">
              <Avatar className="h-6 w-6 mr-2 flex-shrink-0">
                <AvatarImage
                  src={listing.seller?.avatar_url || undefined}
                  alt={getSellerDisplayName()}
                />
                <AvatarFallback>{getSellerInitials()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium truncate">{getSellerDisplayName()}</p>
                <p className="text-sm text-muted-foreground truncate">@{getSellerUsername()}</p>
              </div>
              <div className="text-[12px] text-muted-foreground ml-2 whitespace-nowrap">
                {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })
                  .replace('about ', '')
                  .replace('less than a minute ago', 'just now')
                  .replace(' minutes ago', 'm')
                  .replace(' minute ago', 'm')
                  .replace(' hours ago', 'h')
                  .replace(' hour ago', 'h')
                  .replace(' days ago', 'd')
                  .replace(' day ago', 'd')
                  .replace(' months ago', 'mo')
                  .replace(' month ago', 'mo')
                  .replace(' years ago', 'y')
                  .replace(' year ago', 'y')}
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 truncate group-hover:text-green-600">{listing.title}</h3>
          <p className="text-base text-muted-foreground mb-2 line-clamp-2">{listing.description}</p>
          <div className="flex items-center text-base text-muted-foreground truncate mb-2">
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
              <p className="text-lg font-semibold">
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

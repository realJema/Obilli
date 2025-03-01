"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Seller {
  username: string | null
  full_name: string | null
  avatar_url: string | null
}

interface Listing {
  id: string
  title: string
  description: string
  seller: Seller | null
  location: string
  price: number
  rating: number
  total_reviews: number
  images: string[] | null
}

interface CategorySectionProps {
  title: string
  subtitle: string
  listings: Listing[]
}

export function CategorySection({ title, subtitle, listings }: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Check scroll buttons visibility
  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }, [])

  useEffect(() => {
    checkScrollButtons()
    window.addEventListener("resize", checkScrollButtons)
    return () => window.removeEventListener("resize", checkScrollButtons)
  }, [checkScrollButtons])

  // Smooth scroll functions
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Mouse drag scrolling
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft)
    setScrollLeft(scrollContainerRef.current!.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current!.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleScroll = () => {
    checkScrollButtons()
  }

  // Helper functions
  const getListingImage = (listing: Listing) => {
    if (!listing.images || !Array.isArray(listing.images) || listing.images.length === 0) {
      return "/placeholder.svg"
    }
    return listing.images[0]
  }

  const getSellerInitials = (seller: Seller | null) => {
    if (!seller?.full_name) return "U"
    return seller.full_name.charAt(0).toUpperCase()
  }

  const getSellerDisplayName = (seller: Seller | null) => {
    return seller?.full_name || "Anonymous User"
  }

  const getSellerUsername = (seller: Seller | null) => {
    return seller?.username || "anonymous"
  }

  return (
    <section className="py-12 overflow-hidden">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <Link href={`/filter?category=${encodeURIComponent(title.toLowerCase())}`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="relative overflow-hidden">
          <div
            ref={scrollContainerRef}
            className={cn(
              "flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth -mx-4 px-4",
              isDragging ? "cursor-grabbing" : "cursor-grab",
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onScroll={handleScroll}
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="min-w-[280px] max-w-[280px] flex-shrink-0 scroll-snap-align-start"
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault()
                  }
                }}
              >
                <div className="border rounded-lg overflow-hidden transition-colors hover:border-green-600 h-full flex flex-col">
                  <div className="aspect-video relative">
                    <Image
                      src={getListingImage(listing) || "/placeholder.svg"}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={listing.seller?.avatar_url || undefined}
                            alt={getSellerDisplayName(listing.seller)}
                          />
                          <AvatarFallback>{getSellerInitials(listing.seller)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{getSellerDisplayName(listing.seller)}</p>
                          <p className="text-xs text-muted-foreground">@{getSellerUsername(listing.seller)}</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-green-600">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{listing.description}</p>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">
                        {typeof listing.rating === "number" ? listing.rating.toFixed(1) : "0.0"}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">({listing.total_reviews || 0})</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location || "Location not specified"}
                    </div>
                    <div className="mt-auto">
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-semibold">${listing.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 z-10"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-10"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}


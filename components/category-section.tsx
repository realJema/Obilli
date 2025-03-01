"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listing-card"

interface Seller {
  username: string
  full_name: string
  avatar_url: string | null
}

interface Category {
  name: string
  slug: string
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
  category: Category
}

interface CategorySectionProps {
  title: string
  subtitle: string
  listings: Listing[]
}

export function CategorySection({ title, subtitle, listings }: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft)
    setScrollLeft(scrollContainerRef.current!.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
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
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 600
    const newScrollLeft =
      direction === "left"
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
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
              <div
                key={listing.id}
                className="min-w-[280px] max-w-[280px] flex-shrink-0 scroll-snap-align-start"
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault()
                  }
                }}
              >
                <ListingCard listing={listing} />
              </div>
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


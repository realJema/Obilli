"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Star, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"

// Sample data for listings
const listings = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Professional listing ${i + 1}`,
  description: "High-quality item in great condition.",
  seller: {
    name: `Seller${i + 1}`,
    title: "Level 2 Seller",
    image: `/placeholder.svg?height=50&width=50&text=S${i + 1}`,
  },
  location: {
    town: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"][Math.floor(Math.random() * 5)],
    state: "USA",
  },
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  price: 50 + i * 10,
  rating: 4 + Math.random() * 1,
  image: `/placeholder.svg?height=200&width=300&text=Listing+${i + 1}`,
}))

const ITEMS_PER_PAGE = 12

export default function FilterPage() {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState([0, 500])
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [selectedTowns, setSelectedTowns] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState<string>("all") // Change to string type with default "all"

  // Filter listings
  const filteredListings = listings.filter((listing) => {
    const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1]
    const matchesTown = selectedTowns.length === 0 || selectedTowns.includes(listing.location.town)
    const matchesRating = ratingFilter === "all" || listing.rating >= Number(ratingFilter)
    const listingDate = new Date(listing.createdAt)
    const matchesDate =
      (!dateRange.from || listingDate >= dateRange.from) && (!dateRange.to || listingDate <= dateRange.to)

    return matchesPrice && matchesTown && matchesRating && matchesDate
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE)
  const paginatedListings = filteredListings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Get unique towns
  const towns = Array.from(new Set(listings.map((listing) => listing.location.town)))

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Category</h2>
            <Input placeholder="Search categories" />
          </div>

          <div>
            <h2 className="font-semibold mb-2">Price Range</h2>
            <Slider min={0} max={500} step={10} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
            <div className="flex justify-between text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Date Posted</h2>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

          <div>
            <h2 className="font-semibold mb-2">Location</h2>
            <div className="space-y-2">
              {towns.map((town) => (
                <div key={town} className="flex items-center space-x-2">
                  <Checkbox
                    id={town}
                    checked={selectedTowns.includes(town)}
                    onCheckedChange={(checked) => {
                      setSelectedTowns((prev) => (checked ? [...prev, town] : prev.filter((t) => t !== town)))
                    }}
                  />
                  <Label htmlFor={town}>{town}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Minimum Rating</h2>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any rating</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Seller Level</h2>
            {["Top Rated", "Level 2", "Level 1", "New Seller"].map((level) => (
              <div key={level} className="flex items-center space-x-2 mb-2">
                <Checkbox id={level} />
                <Label htmlFor={level}>{level}</Label>
              </div>
            ))}
          </div>
        </aside>

        {/* Listings */}
        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredListings.length)} of {filteredListings.length} results
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedListings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`} className="group">
                <div className="border rounded-lg overflow-hidden transition-colors hover:border-green-600 h-full flex flex-col">
                  <div className="aspect-video relative">
                    <Image
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={listing.seller.image} alt={listing.seller.name} />
                          <AvatarFallback>{listing.seller.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{listing.seller.name}</p>
                          <p className="text-xs text-muted-foreground">{listing.seller.title}</p>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-green-600 line-clamp-2">{listing.title}</h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{listing.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location.town}, {listing.location.state}
                    </div>
                    <div className="mt-auto">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold">${listing.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Star, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays, subDays, subWeeks, subMonths } from "date-fns"
import { ListingCard } from "@/components/listing-card"
import { DateRange } from "react-day-picker"
import { Breadcrumbs } from "@/components/breadcrumbs"

const ITEMS_PER_PAGE = 12

interface Listing {
  id: string
  title: string
  description: string
  seller: {
    username: string
    full_name: string
    avatar_url: string | null
  }
  location: {
    id: string
    name: string
    slug: string
    parent_id: string | null
    type: 'town' | 'quarter'
  }
  location_id: string
  address: string
  price: number
  rating: number
  total_reviews: number
  images: string[] | null
  category: {
    name: string
    slug: string
    parent?: {
      name: string
      slug: string
      parent?: {
        name: string
        slug: string
      }
    }
  }
  created_at: string
}

interface CategoryInfo {
  name: string;
  slug: string;
  level: 'main' | 'subgroup' | 'subcategory';
  parent?: {
    name: string;
    slug: string;
    parent?: {
      name: string;
      slug: string;
    }
  }
}

// Date range options
const DATE_RANGES = {
  "24h": {
    label: "Last 24 hours",
    from: () => subDays(new Date(), 1),
    to: () => new Date()
  },
  "1w": {
    label: "Last week",
    from: () => subWeeks(new Date(), 1),
    to: () => new Date()
  },
  "1m": {
    label: "Last month",
    from: () => subMonths(new Date(), 1),
    to: () => new Date()
  },
  "all": {
    label: "All time",
    from: () => undefined,
    to: () => undefined
  }
}

export default function FilterPage() {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("500000")
  const [dateRange, setDateRange] = useState<"24h" | "1w" | "1m" | "all">("all")
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState("newest")
  const [listings, setListings] = useState<Listing[]>([])
  const [totalListings, setTotalListings] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [locations, setLocations] = useState<{ id: string, name: string, display_name: string }[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isListingsLoading, setIsListingsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null)

  const handlePriceChange = (value: string, type: 'min' | 'max') => {
    const numValue = value === '' ? (type === 'min' ? '0' : '500000') : value
    if (type === 'min') {
      setMinPrice(numValue)
    } else {
      setMaxPrice(numValue)
    }
  }

  useEffect(() => {
    // Fetch locations for the filter
    async function fetchInitialData() {
      try {
        setIsInitialLoading(true)
        const [locationsResponse] = await Promise.all([
          fetch('/api/locations')
        ])
        
        const locationsData = await locationsResponse.json()
        if (locationsResponse.ok) {
          setLocations(locationsData.locations)
        }
      } catch (err) {
        console.error('Error fetching initial data:', err)
      } finally {
        setIsInitialLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    async function fetchCategoryInfo() {
      const categorySlug = searchParams.get('category')
      const subgroupSlug = searchParams.get('subgroup')
      const subcategorySlug = searchParams.get('subcategory')

      if (!categorySlug) {
        setCategoryInfo(null)
        return
      }

      try {
        let url = `/api/categories/${categorySlug}`
        if (subcategorySlug) {
          url += `?subcategory=${subcategorySlug}`
        } else if (subgroupSlug) {
          url += `?subgroup=${subgroupSlug}`
        }

        const response = await fetch(url)
        const data = await response.json()
        if (response.ok) {
          setCategoryInfo(data.category)
        }
      } catch (err) {
        console.error('Error fetching category info:', err)
      }
    }
    fetchCategoryInfo()
  }, [searchParams])

  useEffect(() => {
    async function fetchListings() {
      try {
        setIsListingsLoading(true)
        const category = searchParams.get('category')
        
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          minPrice: minPrice,
          maxPrice: maxPrice,
        })

        if (category) {
          queryParams.set('category', category)
        }

        if (selectedLocations.length > 0) {
          queryParams.set('location', selectedLocations.join(','))
        }

        if (ratingFilter !== 'all') {
          queryParams.set('minRating', ratingFilter)
        }

        const response = await fetch(`/api/listings?${queryParams.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch listings')
        }

        setListings(data.listings)
        setTotalListings(data.total)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsListingsLoading(false)
      }
    }

    fetchListings()
  }, [searchParams, currentPage, minPrice, maxPrice, selectedLocations, ratingFilter, sortBy])

  const getBreadcrumbItems = () => {
    if (!categoryInfo) return []

    const items = []

    if (categoryInfo.level === 'subcategory' && categoryInfo.parent?.parent) {
      items.push(
        {
          label: categoryInfo.parent.parent.name,
          href: `/filter?category=${categoryInfo.parent.parent.slug}`
        },
        {
          label: categoryInfo.parent.name,
          href: `/filter?category=${categoryInfo.parent.parent.slug}&subgroup=${categoryInfo.parent.slug}`
        },
        {
          label: categoryInfo.name,
          href: `/filter?category=${categoryInfo.parent.parent.slug}&subgroup=${categoryInfo.parent.slug}&subcategory=${categoryInfo.slug}`
        }
      )
    } else if (categoryInfo.level === 'subgroup' && categoryInfo.parent) {
      items.push(
        {
          label: categoryInfo.parent.name,
          href: `/filter?category=${categoryInfo.parent.slug}`
        },
        {
          label: categoryInfo.name,
          href: `/filter?category=${categoryInfo.parent.slug}&subgroup=${categoryInfo.slug}`
        }
      )
    } else {
      items.push({
        label: categoryInfo.name,
        href: `/filter?category=${categoryInfo.slug}`
      })
    }

    return items
  }

  const getCategoryPath = () => {
    if (!categoryInfo || categoryInfo.level === 'main' || !categoryInfo.parent) return null

    if (categoryInfo.level === 'subcategory' && categoryInfo.parent.parent) {
      return `${categoryInfo.parent.parent.name} {'>'} ${categoryInfo.parent.name} {'>'} ${categoryInfo.name}`
    }

    return `${categoryInfo.parent.name} {'>'} ${categoryInfo.name}`
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {categoryInfo && (
        <>
          <Breadcrumbs items={getBreadcrumbItems()} />
          <div className="mt-6 mb-8">
            <h1 className="text-2xl font-bold">{categoryInfo.name}</h1>
            {categoryInfo.level !== 'main' && categoryInfo.parent && (
              <p className="text-muted-foreground mt-2">
                {getCategoryPath()}
              </p>
            )}
          </div>
        </>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          {isInitialLoading ? (
            <>
              {/* Price Range Skeleton */}
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <div className="h-4 w-8 bg-muted animate-pulse rounded" />
                    <div className="h-9 w-full bg-muted animate-pulse rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-8 bg-muted animate-pulse rounded" />
                    <div className="h-9 w-full bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </div>

              {/* Date Posted Skeleton */}
              <div className="space-y-2">
                <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                <div className="h-9 w-full bg-muted animate-pulse rounded" />
              </div>

              {/* Location Skeleton */}
              <div className="space-y-2">
                <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Skeleton */}
              <div className="space-y-2">
                <div className="h-5 w-28 bg-muted animate-pulse rounded" />
                <div className="h-9 w-full bg-muted animate-pulse rounded" />
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-semibold mb-2">Price Range (FCFA)</h2>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minPrice">Min</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => handlePriceChange(e.target.value, 'min')}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice">Max</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => handlePriceChange(e.target.value, 'max')}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Date Posted</h2>
                <Select value={dateRange} onValueChange={(value: "24h" | "1w" | "1m" | "all") => setDateRange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Location</h2>
                <div className="space-y-2">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={location.id}
                        checked={selectedLocations.includes(location.id)}
                        onCheckedChange={(checked) => {
                          setSelectedLocations((prev) => 
                            checked 
                              ? [...prev, location.id]
                              : prev.filter((id) => id !== location.id)
                          )
                        }}
                      />
                      <Label htmlFor={location.id}>{location.display_name}</Label>
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
            </>
          )}
        </aside>

        {/* Listings */}
        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {isListingsLoading ? (
                "Loading..."
              ) : (
                `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, totalListings)} of ${totalListings} results`
              )}
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
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

          {isListingsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  {/* Image */}
                  <div className="aspect-[4/3] rounded-lg bg-muted animate-pulse" />
                  {/* Content */}
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted animate-pulse rounded" />
                      <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
                    </div>
                    {/* Seller Info */}
                    <div className="flex items-center space-x-2 pt-2">
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                    {/* Price */}
                    <div className="h-5 w-20 bg-muted animate-pulse rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No listings found matching your criteria
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isListingsLoading}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  disabled={isListingsLoading}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isListingsLoading}
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


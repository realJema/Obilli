"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  name: string
  slug: string
  subgroups: {
    id: string
    name: string
    slug: string
    subcategories: {
      id: string
      name: string
      slug: string
    }[]
  }[]
}

interface Listing {
  id: string
  title: string
  price: number
  description: string
  images: string[]
  seller: {
    username: string
    full_name: string
    avatar_url: string | null
  }
  category: {
    name: string
    slug: string
  }
  rating: number
  total_reviews: number
}

export default function TestPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories")
        setCategories(categoriesData)

        // Fetch listings
        const listingsRes = await fetch("/api/listings")
        const listingsData = await listingsRes.json()
        if (!listingsRes.ok) throw new Error("Failed to fetch listings")
        setListings(listingsData.listings)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  if (error) {
    return <div className="container py-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="container py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Categories Structure Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="border p-4 rounded-lg">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <div className="ml-4 mt-2 space-y-2">
                  {category.subgroups.map((subgroup) => (
                    <div key={subgroup.id}>
                      <h4 className="font-semibold text-md">{subgroup.name}</h4>
                      <div className="ml-4 text-sm text-muted-foreground">
                        {subgroup.subcategories.map((sub) => (
                          <div key={sub.id}>{sub.name}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listings Data Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      By {listing.seller.full_name} (@{listing.seller.username})
                    </p>
                    <p className="text-sm">Category: {listing.category.name}</p>
                    <p className="text-sm">Price: ${listing.price}</p>
                    <p className="text-sm">
                      Rating: {listing.rating} ({listing.total_reviews} reviews)
                    </p>
                  </div>
                  {listing.images && listing.images.length > 0 && (
                    <div className="flex gap-2">
                      {listing.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`${listing.title} - Image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Test Filters</h3>
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  const res = await fetch("/api/listings?minPrice=200&maxPrice=500")
                  const data = await res.json()
                  setListings(data.listings)
                }}
              >
                Price $200-$500
              </Button>
              <Button
                onClick={async () => {
                  const res = await fetch("/api/listings?location=New%20York")
                  const data = await res.json()
                  setListings(data.listings)
                }}
              >
                New York Only
              </Button>
              <Button
                onClick={async () => {
                  const res = await fetch("/api/listings")
                  const data = await res.json()
                  setListings(data.listings)
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Data Summary</h3>
            <div className="space-y-2 text-sm">
              <p>Total Categories: {categories.length}</p>
              <p>Total Subgroups: {categories.reduce((acc, cat) => acc + cat.subgroups.length, 0)}</p>
              <p>
                Total Subcategories:{" "}
                {categories.reduce(
                  (acc, cat) => acc + cat.subgroups.reduce((subacc, sub) => subacc + sub.subcategories.length, 0),
                  0,
                )}
              </p>
              <p>Total Listings: {listings.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


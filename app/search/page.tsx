"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ListingCard } from "@/components/listing-card"
import { Skeleton } from "@/components/ui/skeleton"

interface Seller {
  username: string
  full_name: string
  avatar_url: string | null
}

interface Category {
  id: string
  name: string
  slug: string
}

interface SearchResult {
  id: string
  title: string
  description: string
  price: number
  created_at: string
  images: string[] | null
  seller: Seller | null
  category: Category
  location_id: string
  address: string
  total_reviews: number
  rating: number
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="aspect-[16/9] w-full" />
          <div className="p-4">
            <div className="flex items-center mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="ml-2 flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex justify-between items-end">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchListings = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setError(null)
        return
      }

      setIsSearching(true)
      setError(null)

      try {
        const params = new URLSearchParams({ q: searchQuery })
        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Search request failed')
        }

        setResults(data.results)
        
        // Update URL with search query
        const newUrl = `/search?${params.toString()}`
        window.history.pushState({}, '', newUrl)
      } catch (error) {
        console.error("Search error:", error)
        setError(error instanceof Error ? error.message : 'Search failed')
        setResults([])
      } finally {
        setIsSearching(false)
      }
    },
    []
  )

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchListings(query)
      } else {
        setResults([])
        setError(null)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, searchListings])

  // Initial search if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      searchListings(initialQuery)
    }
  }, [initialQuery, searchListings])

  return (
    <div className="container py-8 min-h-[800px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Listings</h1>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for listings..."
            className="pl-10"
          />
        </div>
      </div>

      {isSearching ? (
        <SearchSkeleton />
      ) : error ? (
        <div className="py-8 text-red-500">
          {error}
        </div>
      ) : results.length === 0 ? (
        <div className="py-8 text-muted-foreground">
          {query.trim() ? "No results found." : "Start typing to search..."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {results.map((result) => (
            <ListingCard
              key={result.id}
              listing={result}
              variant="compact"
            />
          ))}
        </div>
      )}
    </div>
  )
} 

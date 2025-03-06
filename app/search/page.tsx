"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ListingCard } from "@/components/listing-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { Database } from "@/lib/supabase/types"

type Seller = {
  username: string
  full_name: string
  avatar_url: string | null
}

type Category = {
  id: string
  name: string
  slug: string
}

type Listing = Database["public"]["Tables"]["listings"]["Row"] & {
  seller: Seller | null
  category: Category
  rating: number
  total_reviews: number
}

interface SearchResponse {
  results: Listing[]
  total: number
  page: number
  totalPages: number
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 15 }).map((_, i) => (
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

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialPage = parseInt(searchParams.get("page") || "1")
  
  const [query, setQuery] = useState(initialQuery)
  const [page, setPage] = useState(initialPage)
  const [searchResponse, setSearchResponse] = useState<SearchResponse>({
    results: [],
    total: 0,
    page: 1,
    totalPages: 1
  })
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchListings = useCallback(
    async (searchQuery: string, pageNumber: number) => {
      if (!searchQuery.trim()) {
        setSearchResponse({ results: [], total: 0, page: 1, totalPages: 1 })
        setError(null)
        return
      }

      setIsSearching(true)
      setError(null)

      try {
        const params = new URLSearchParams({ 
          q: searchQuery,
          page: pageNumber.toString()
        })
        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Search request failed')
        }

        setSearchResponse(data)
        
        // Update URL with search query and page
        const newUrl = `/search?${params.toString()}`
        window.history.pushState({}, '', newUrl)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Search failed')
        setSearchResponse({ results: [], total: 0, page: 1, totalPages: 1 })
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
        searchListings(query, page)
      } else {
        setSearchResponse({ results: [], total: 0, page: 1, totalPages: 1 })
        setError(null)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, page, searchListings])

  // Initial search if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      searchListings(initialQuery, initialPage)
    }
  }, [initialQuery, initialPage, searchListings])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="container py-8 min-h-[800px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Listings</h1>
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1) // Reset to first page on new search
            }}
            placeholder="Search listings..."
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
      ) : searchResponse.results.length === 0 ? (
        <div className="py-8 text-muted-foreground">
          {query.trim() ? "No results found." : "Start typing to search..."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {searchResponse.results.map((result) => (
              <ListingCard
                key={result.id}
                listing={result}
                variant="compact"
              />
            ))}
          </div>

          {searchResponse.totalPages > 1 && (
            <Pagination
              currentPage={searchResponse.page}
              totalPages={searchResponse.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  )
} 

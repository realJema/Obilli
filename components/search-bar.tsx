"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface SearchResult {
  id: string
  title: string
  description: string
  price: number
}

function SearchBarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search function
  const searchListings = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsSearching(true)
      try {
        const category = searchParams.get("category")
        const params = new URLSearchParams({ q: searchQuery })
        if (category) params.set("category", category)

        const response = await fetch(`/api/search?${params}`)
        const data = await response.json()
        
        if (data.error) {
          console.error("Search error:", data.error)
          setResults([])
          return
        }

        setResults(data.results || [])
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    },
    [searchParams],
  )

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchListings(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, searchListings])

  const handleSelect = (resultId: string) => {
    setOpen(false)
    setQuery("")
    router.push(`/listings/${resultId}`)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        Search listings...
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search listings..." 
          value={query} 
          onValueChange={setQuery}
        />
        <CommandList>
          {isSearching ? (
            <CommandEmpty>Searching...</CommandEmpty>
          ) : !results || results.length === 0 ? (
            <CommandEmpty>
              {query.trim() ? "No results found." : "Start typing to search..."}
            </CommandEmpty>
          ) : (
            <CommandGroup heading="Listings">
              {results.map((result) => (
                <CommandItem 
                  key={result.id} 
                  onSelect={() => handleSelect(result.id)}
                  className="flex items-center justify-between"
                >
                  <span>{result.title}</span>
                  <span className="text-sm text-muted-foreground">
                    ${result.price}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export function SearchBar() {
  return (
    <Suspense fallback={null}>
      <SearchBarContent />
    </Suspense>
  )
}


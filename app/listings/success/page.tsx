"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

function ListingSuccessContent() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get("id")

  return (
    <div className="min-h-[80vh] container max-w-2xl py-24 flex items-center">
      <div className="w-full text-center space-y-8">
        <div className="flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Listing Created Successfully!</h1>
          <p className="text-xl text-muted-foreground">
            Your listing has been created and is now visible to potential buyers.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-4">
          <Button asChild size="lg" className="text-base">
            <Link href={`/listings/${listingId}`}>
              View Listing
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base">
            <Link href="/listings/create">
              Create Another Listing
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ListingSuccessPage() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900/50">
      <Suspense 
        fallback={
          <div className="min-h-[80vh] container flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        }
      >
        <ListingSuccessContent />
      </Suspense>
    </div>
  )
} 

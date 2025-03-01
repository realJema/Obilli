"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ListingSuccessPage() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get("id")

  return (
    <div className="container max-w-2xl py-16">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Listing Created Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Your listing has been created and is now visible to potential buyers.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href={`/listings/${listingId}`}>
              View Listing
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/listings/create">
              Create Another Listing
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 

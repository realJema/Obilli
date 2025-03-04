import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"

export default function ListingDetailsLoading() {
  return (
    <div className="container py-8">
      {/* Back button */}
      <div className="inline-flex items-center text-sm text-muted-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-24" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-32" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          {/* Title */}
          <Skeleton className="h-10 w-3/4 mb-4" />

          {/* Seller info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Main Image */}
          <div className="aspect-video relative mb-4">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>

          {/* Description */}
          <div className="mb-12">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:sticky md:top-8 h-fit">
          <div className="border rounded-lg p-6 space-y-6">
            {/* Price */}
            <Skeleton className="h-8 w-32 mb-4" />

            {/* Rating */}
            <div className="flex items-center mb-4">
              <Skeleton className="h-4 w-24 mr-2" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Details */}
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-5 w-48" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 

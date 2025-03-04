import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreateListingLoading() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900/50">
      <div className="container max-w-3xl py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Progress bar skeleton */}
        <div className="mb-8">
          <Skeleton className="h-2 w-full mb-4" />
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <Skeleton key={step} className="h-4 w-24" />
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 

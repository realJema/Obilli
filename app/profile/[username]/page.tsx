import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, MapPin } from "lucide-react"

import { getUserByUsername } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={user.avatar || `/placeholder.svg?text=${user.name.charAt(0)}`}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
          {user.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {user.location}
            </div>
          )}
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-2xl font-bold">{user.listingsCount}</div>
              <div className="text-sm text-muted-foreground">Listings</div>
            </div>
            <div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-2xl font-bold">{user.rating.toFixed(1)}</span>
              </div>
              <div className="text-sm text-muted-foreground">{user.reviews} reviews</div>
            </div>
          </div>
          {user.bio && <p className="text-sm">{user.bio}</p>}
          <Button className="w-full">Contact</Button>
        </div>

        <div>
          <Tabs defaultValue="listings">
            <TabsList>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="listings" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{/* Listings will go here */}</div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">{/* Reviews will go here */}</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


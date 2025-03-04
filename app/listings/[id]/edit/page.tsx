"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  subgroups?: {
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

interface Location {
  id: string
  name: string
  slug: string
  parent_id: string | null
  type: "town" | "quarter"
  quarters?: Location[]
}

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedTown, setSelectedTown] = useState<string>("")
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("")
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    category_id: "",
    location_id: "",
    address: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const supabase = createClientComponentClient()

        // Fetch the listing with category hierarchy
        const { data: listing, error: listingError } = await supabase
          .from("listings")
          .select(`
            *,
            location:locations!listings_location_id_fkey(
              id,
              name,
              slug,
              parent_id,
              type
            ),
            category:categories!listings_category_id_fkey(
              id,
              name,
              slug,
              parent_id
            )
          `)
          .eq("id", params.id)
          .single()

        if (listingError) throw listingError
        if (!listing) throw new Error("Listing not found")

        // Check if user owns the listing
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.id !== listing.seller_id) {
          router.push("/")
          return
        }

        // Fetch all categories with hierarchy
        const { data: allCategories, error: categoriesError } = await supabase
          .from("categories")
          .select("id, name, slug, parent_id")
          .order("name")

        if (categoriesError) throw categoriesError

        // Process categories into hierarchy
        const mainCategories = allCategories.filter((cat) => !cat.parent_id)
        const processedCategories = mainCategories.map((mainCat) => {
          // Get all subgroups for this main category
          const subgroups = allCategories
            .filter((cat) => cat.parent_id === mainCat.id)
            .map((subgroup) => ({
              id: subgroup.id,
              name: subgroup.name,
              slug: subgroup.slug,
              subcategories: allCategories
                .filter((cat) => cat.parent_id === subgroup.id)
                .map((sub) => ({
                  id: sub.id,
                  name: sub.name,
                  slug: sub.slug,
                }))
            }))

          return {
            id: mainCat.id,
            name: mainCat.name,
            slug: mainCat.slug,
            parent_id: mainCat.parent_id,
            subgroups,
          }
        })

        // Find the main category for the current listing's subcategory
        if (listing.category) {
          // Get the subgroup (parent of the subcategory)
          const subgroup = allCategories.find(cat => cat.id === listing.category.parent_id)
          if (subgroup) {
            // Get the main category (parent of the subgroup)
            const mainCategory = allCategories.find(cat => cat.id === subgroup.parent_id)
            if (mainCategory) {
              setSelectedMainCategory(mainCategory.id)
            }
          }
        }

        // Fetch locations
        const { data: locations, error: locationsError } = await supabase
          .from("locations")
          .select("id, name, slug, parent_id, type")
          .order("name")

        if (locationsError) throw locationsError

        // Process locations into hierarchy
        const towns = locations.filter((loc: Location) => loc.type === "town")
        const processedLocations = towns.map((town: Location) => ({
          ...town,
          quarters: locations.filter((loc: Location) => loc.parent_id === town.id),
        }))

        // Set initial town if the listing has a location
        let initialTown = ""
        if (listing.location) {
          if (listing.location.type === "quarter") {
            // If it's a quarter, find its parent town
            const parentTown = processedLocations.find((town: Location) => 
              town.quarters?.some((quarter: Location) => quarter.id === listing.location_id)
            )
            if (parentTown) {
              initialTown = parentTown.id
            }
          } else {
            // If it's a town, use it directly
            initialTown = listing.location_id
          }
        }

        setCategories(processedCategories)
        setLocations(processedLocations)
        setSelectedTown(initialTown)
        setImages(listing.images || [])
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price.toString(),
          condition: listing.condition,
          category_id: listing.category_id,
          location_id: listing.location_id,
          address: listing.address,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load listing")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setSaving(true)
      const supabase = createClientComponentClient()

      // Update the listing
      const { error } = await supabase
        .from("listings")
        .update({
          ...formData,
          price: parseInt(formData.price),
          images,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)

      if (error) throw error

      toast.success("Listing updated successfully")
      router.push(`/listings/${params.id}`)
    } catch (error) {
      console.error("Error updating listing:", error)
      toast.error("Failed to update listing")
    } finally {
      setSaving(false)
    }
  }

  const handleImagesChange = (urls: string[]) => {
    setImages(urls)
  }

  const handleImageRemove = (url: string) => {
    setImages(images.filter((image) => image !== url))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900/50">
        <div className="container max-w-3xl py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900/50">
      <div className="container max-w-3xl py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Edit Listing</h1>
          <p className="text-muted-foreground">
            Update your listing information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (XAF)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="space-y-6">
                <Select
                  value={selectedMainCategory}
                  onValueChange={(value) => {
                    setSelectedMainCategory(value)
                    setFormData(prev => ({ ...prev, category_id: "" }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select main category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedMainCategory && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {categories
                        .find((cat) => cat.id === selectedMainCategory)
                        ?.subgroups?.flatMap((subgroup) => subgroup.subcategories)
                        .map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category_id: subcategory.id }))}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm transition-colors",
                              "border hover:bg-primary hover:text-primary-foreground",
                              formData.category_id === subcategory.id
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-muted-foreground/25"
                            )}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg">Town</Label>
                <Select
                  value={selectedTown}
                  onValueChange={(value) => {
                    setSelectedTown(value)
                    // Only reset location_id if selecting a different town
                    if (value !== selectedTown) {
                      setFormData(prev => ({ ...prev, location_id: "" }))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select town" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((town) => (
                      <SelectItem key={town.id} value={town.id}>
                        {town.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTown && (
                <div className="space-y-4">
                  <Label className="text-lg">Quarter</Label>
                  <div className="flex flex-wrap gap-3">
                    {locations
                      .find((town) => town.id === selectedTown)
                      ?.quarters?.map((quarter) => (
                        <button
                          key={quarter.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, location_id: quarter.id }))}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm transition-colors",
                            "border hover:bg-primary hover:text-primary-foreground",
                            formData.location_id === quarter.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-muted-foreground/25",
                          )}
                        >
                          {quarter.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="address" className="text-lg">
                  Specific Address
                </Label>
                <Input
                  id="address"
                  placeholder="Enter specific address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Images</Label>
                <ImageUpload
                  value={images}
                  onChange={handleImagesChange}
                  onRemove={handleImageRemove}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 

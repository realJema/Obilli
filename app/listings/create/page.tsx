"use client"

import type React from "react"
import type { Database } from "@/lib/supabase/types"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation" // Using Next.js App Router
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Upload, Loader2, X, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import CreateListingLoading from "./loading"

// Types from your Supabase database
type Category = Database["public"]["Tables"]["categories"]["Row"]
type Location = Database["public"]["Tables"]["locations"]["Row"] & {
  quarters?: Location[]
}

interface FormData {
  title: string
  description: string
  category_id: string
  location_id: string
  address: string
  price: number
  condition: string
  images: string[]
  category_parent: string
}

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Used"]

const STEPS = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Category & Location" },
  { id: 3, name: "Pricing & Condition" },
  { id: 4, name: "Images" },
  { id: 5, name: "Review" },
]

function CreateListingContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [selectedTown, setSelectedTown] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category_id: "",
    location_id: "",
    address: "",
    price: 0,
    condition: "",
    images: [],
    category_parent: "",
  })
  const [isDragging, setIsDragging] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in?redirectTo=/listings/create")
    }
  }, [user, isLoading, router])

  // Fetch categories and locations on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setFetchingData(true)

        // Check session first
        const sessionPromise = supabase.auth.getSession()
        const categoriesPromise = supabase.from("categories").select("*").order("name")
        const locationsPromise = supabase.from("locations").select("*").order("name")

        // Fetch all data in parallel
        const [
          { data: { session }, error: sessionError },
          { data: categoriesData, error: categoriesError },
          { data: locationsData, error: locationsError }
        ] = await Promise.all([
          sessionPromise,
          categoriesPromise,
          locationsPromise
        ])

        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`)
        }

        if (!session) {
          router.push('/auth/sign-in?redirect=/listings/create')
          return
        }

        if (categoriesError) {
          throw new Error(`Error fetching categories: ${categoriesError.message}`)
        }

        if (locationsError) {
          throw new Error(`Error fetching locations: ${locationsError.message}`)
        }

        // Process locations into hierarchy
        const towns = locationsData.filter((loc) => loc.type === "town")
        const processedLocations = towns.map((town) => ({
          ...town,
          quarters: locationsData.filter((loc) => loc.parent_id === town.id),
        }))

        setCategories(categoriesData)
        setLocations(processedLocations)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load categories and locations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setFetchingData(false)
      }
    }

    if (!isLoading) {
      fetchData()
    }
  }, [supabase, toast, router, isLoading])

  // Generate preview URLs for selected images
  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [selectedFiles])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const totalFiles = selectedFiles.length + files.length

    // Validate total file count
    if (totalFiles > 5) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 5 images in total",
        variant: "destructive",
      })
      return
    }

    // Validate file sizes and types
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
      }

      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive",
        })
      }

      return isValidType && isValidSize
    })

    // Append new files to existing ones
    setSelectedFiles((prev) => [...prev, ...validFiles])
    
    // Reset the input value to allow selecting the same file again
    event.target.value = ""
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const updateFormData = (key: keyof FormData, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // Get main categories and subcategories
  const mainCategories = categories.filter((cat) => !cat.parent_id)
  const getSubcategories = (parentId: string) => categories.filter((cat) => cat.parent_id === parentId)

  // Validate current step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.title && formData.description)
      case 2:
        return !!(formData.category_id && formData.location_id)
      case 3:
        return !!(formData.price > 0 && formData.condition)
      case 4:
        return selectedFiles.length > 0
      default:
        return true
    }
  }

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Form submission handler
  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a listing",
        variant: "destructive",
      })
      router.push('/auth/sign-in?redirect=/listings/create')
      return
    }

    setIsSubmitting(true)

    try {
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        throw new Error("Your session has expired. Please log in again.")
      }

      // Validate form data
      if (
        !formData.title ||
        !formData.description ||
        !formData.category_id ||
        !formData.location_id ||
        !formData.price ||
        !formData.condition ||
        !selectedFiles.length
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Upload images
      const imageUrls: string[] = []
      const totalFiles = selectedFiles.length
      let uploadedFiles = 0

      // Upload all images in parallel for better performance
      const uploadPromises = selectedFiles.map(async (file, index) => {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${session.user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("listing_images")
          .upload(filePath, file, {
            upsert: true,
          })

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("listing_images").getPublicUrl(filePath)

        imageUrls[index] = publicUrl
        uploadedFiles++
        setUploadProgress((uploadedFiles / totalFiles) * 100)
      })

      // Wait for all uploads to complete
      await Promise.all(uploadPromises)

      // Reset progress
      setUploadProgress(0)

      // Create listing with all image URLs
      const { error: insertError, data: insertedListing } = await supabase
        .from("listings")
        .insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          category_id: formData.category_id,
          location_id: formData.location_id,
          address: formData.address,
          seller_id: session.user.id,
          condition: formData.condition,
          images: imageUrls, // This is now guaranteed to contain all image URLs in the correct order
        })
        .select()
        .single()

      if (insertError) throw insertError

      toast({
        title: "Success",
        description: "Your listing has been created successfully",
      })

      // Redirect to success page with listing ID
      router.push(`/listings/success?id=${insertedListing.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const totalFiles = selectedFiles.length + files.length

    // Validate total file count
    if (totalFiles > 5) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 5 images in total",
        variant: "destructive",
      })
      return
    }

    // Validate file sizes and types
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
      }

      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive",
        })
      }

      return isValidType && isValidSize
    })

    setSelectedFiles((prev) => [...prev, ...validFiles])
  }

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    const draggedFile = selectedFiles[dragIndex]
    const newFiles = [...selectedFiles]
    newFiles.splice(dragIndex, 1)
    newFiles.splice(dropIndex, 0, draggedFile)
    setSelectedFiles(newFiles)
  }

  const handleImageDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
    e.currentTarget.classList.add('opacity-50')
  }

  const handleImageDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50')
  }

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-primary')
  }

  const handleImageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-primary')
  }

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary')
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))
    if (dragIndex !== dropIndex) {
      handleReorder(dragIndex, dropIndex)
    }
  }

  // Early return if loading
  if (isLoading || fetchingData) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Early return if no user
  if (!user) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-4">You need to be signed in to create a listing.</p>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => router.push("/auth/sign-in?redirect=/listings/create")}
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  // Early return if no categories or locations are loaded
  if (!categories.length || !locations.length) {
    return (
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to Load Form</h1>
          <p className="text-muted-foreground mb-4">We couldn't load the necessary data. Please try again later.</p>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => router.refresh()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a New Listing</h1>
        <p className="text-muted-foreground">Fill in the details below to create your listing.</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
        <div className="flex justify-between mt-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={cn("text-sm", currentStep >= step.id ? "text-primary" : "text-muted-foreground")}
            >
              {step.name}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Basic Information */}
          <div className={cn(currentStep === 1 ? "block" : "hidden")}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter your listing title"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your listing in detail"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  className="min-h-[300px] text-lg leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Category & Location */}
          <div className={cn(currentStep === 2 ? "block" : "hidden")}>
            <div className="space-y-8">
              <div className="space-y-4">
                <Label className="text-lg">Category</Label>
                <div className="space-y-6">
                  <Select
                    value={formData.category_parent || ""}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, category_parent: value, category_id: "" }))
                    }}
                  >
                    <SelectTrigger className="text-lg">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mainCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-base">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {formData.category_parent && (
                    <div className="space-y-3">
                      <Label className="text-base text-muted-foreground">Select a subcategory</Label>
                      <div className="flex flex-wrap gap-3">
                        {categories
                          .filter((cat) => {
                            const parent = categories.find((p) => p.id === cat.parent_id)
                            return parent && parent.parent_id === formData.category_parent
                          })
                          .map((subcategory) => (
                            <button
                              key={subcategory.id}
                              onClick={() => updateFormData("category_id", subcategory.id)}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm transition-colors",
                                "border hover:bg-primary hover:text-primary-foreground",
                                formData.category_id === subcategory.id
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-muted-foreground/25",
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
                  <div className="flex flex-wrap gap-3">
                    {locations.map((town) => (
                      <button
                        key={town.id}
                        onClick={() => {
                          setSelectedTown(town.id)
                          updateFormData("location_id", "")
                        }}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm transition-colors",
                          "border hover:bg-primary hover:text-primary-foreground",
                          selectedTown === town.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-muted-foreground/25",
                        )}
                      >
                        {town.name}
                      </button>
                    ))}
                  </div>
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
                            onClick={() => updateFormData("location_id", quarter.id)}
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
                    Specific Address (Optional)
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter specific address (optional)"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Pricing & Condition */}
          <div className={cn(currentStep === 3 ? "block" : "hidden")}>
            <div className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="price" className="text-lg">
                  Price (FCFA)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  value={formData.price || ""}
                  onChange={(e) => updateFormData("price", Number.parseFloat(e.target.value) || 0)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-lg">Condition</Label>
                <div className="flex flex-wrap gap-3">
                  {CONDITIONS.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => updateFormData("condition", condition)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-colors",
                        "border hover:bg-primary hover:text-primary-foreground",
                        formData.condition === condition
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-muted-foreground/25",
                      )}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Images */}
          <div className={cn(currentStep === 4 ? "block" : "hidden")}>
            <div className="space-y-6">
              <div>
                <Label className="text-lg">Images (up to 5)</Label>
                <p className="text-muted-foreground mt-1 text-base">Upload high-quality images of your item</p>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-6">
                  {previewUrls.map((url, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square group border-2 border-transparent hover:border-muted-foreground/25 rounded-lg cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={(e) => handleImageDragStart(e, index)}
                      onDragEnd={handleImageDragEnd}
                      onDragOver={(e) => handleImageDragOver(e, index)}
                      onDragLeave={handleImageDragLeave}
                      onDrop={(e) => handleImageDrop(e, index)}
                    >
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-2 left-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Image {index + 1} of {previewUrls.length} (Drag to reorder)
                      </div>
                    </div>
                  ))}
                  {previewUrls.length < 5 && (
                    <div 
                      className={cn(
                        "relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center",
                        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                        "transition-colors duration-200"
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Label htmlFor="images" className="flex flex-col items-center cursor-pointer p-4">
                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                        <span className="text-sm font-medium text-center">
                          Add {5 - selectedFiles.length} more {5 - selectedFiles.length === 1 ? 'image' : 'images'}
                        </span>
                      </Label>
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>
                  )}
                </div>
              )}

              {previewUrls.length === 0 && (
                <div 
                  className={cn(
                    "aspect-square border-2 border-dashed rounded-lg p-8 flex items-center justify-center",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    "transition-colors duration-200"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Label htmlFor="images" className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
                    <span className="text-lg font-medium mb-1">Click to upload images</span>
                    <span className="text-muted-foreground">or drag and drop</span>
                  </Label>
                </div>
              )}

              {uploadProgress > 0 && (
                <div className="mt-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Uploading images... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 5: Review */}
          <div className={cn(currentStep === 5 ? "block" : "hidden")}>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-2">Review Your Listing</h3>
                <p className="text-muted-foreground text-lg">Please review your listing details before submitting.</p>
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <Label className="text-lg">Images</Label>
                <div className="space-y-4">
                  {/* Main/Cover Image */}
                  {previewUrls.length > 0 && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={previewUrls[0] || "/placeholder.svg"}
                        alt="Cover Image"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute bottom-2 left-2 text-white text-sm font-medium bg-black/60 px-2 py-1 rounded">
                        Cover Image
                      </div>
                    </div>
                  )}

                  {/* Additional Images */}
                  {previewUrls.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {previewUrls.slice(1).map((url, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 2}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                          <div className="absolute bottom-2 left-2 text-white text-sm font-medium bg-black/60 px-2 py-1 rounded">
                            Image {index + 2}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Full Width Title */}
              <div>
                <Label className="text-lg">Title</Label>
                <p className="mt-2 text-lg font-medium">{formData.title}</p>
              </div>

              {/* Full Width Description */}
              <div>
                <Label className="text-lg">Description</Label>
                <div className="mt-2 text-lg whitespace-pre-line bg-muted/50 rounded-lg p-4">
                  {formData.description}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg">Price</Label>
                    <p className="mt-2 text-lg font-medium">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: 'XAF',
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0
                      }).format(formData.price)}
                    </p>
                  </div>

                  <div>
                    <Label className="text-lg">Condition</Label>
                    <p className="mt-2 text-lg font-medium">{formData.condition}</p>
                  </div>

                  <div>
                    <Label className="text-lg">Category</Label>
                    <p className="mt-2 text-lg font-medium">
                      {categories.find((cat) => cat.id === formData.category_id)?.name || "Not selected"}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg">Location</Label>
                    <p className="mt-2 text-lg font-medium">
                      {locations.find((town) => town.id === selectedTown)?.name},{" "}
                      {locations
                        .find((town) => town.id === selectedTown)
                        ?.quarters?.find((quarter) => quarter.id === formData.location_id)?.name}
                    </p>
                    {formData.address && (
                      <p className="mt-1 text-muted-foreground">{formData.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} disabled={!validateCurrentStep()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !validateCurrentStep()}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Listing
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CreateListingPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900/50">
      <Suspense fallback={<CreateListingLoading />}>
        <CreateListingContent />
      </Suspense>
    </div>
  )
}


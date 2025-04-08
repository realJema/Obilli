"use client"

import type React from "react"
import type { Database } from "@/lib/supabase/types"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation" // Using Next.js App Router
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Upload, Loader2, X, ChevronRight, ChevronLeft, Check, Expand, ZoomIn } from "lucide-react"
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
type Location = {
  id: string
  name: string
  slug: string
  parent_id: string | null
  type: string
  towns?: Location[]
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
}

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Used"]

const STEPS = [
  { id: 1, name: "Basic Information" },
  { id: 2, name: "Category & Location" },
  { id: 3, name: "Pricing & Condition" },
  { id: 4, name: "Images" },
  { id: 5, name: "Review" },
]

const PRESET_PRICES = [
  { label: "1,000", value: 1000 },
  { label: "2,000", value: 2000 },
  { label: "5,000", value: 5000 },
  { label: "10,000", value: 10000 },
  { label: "15,000", value: 15000 },
  { label: "20,000", value: 20000 },
  { label: "25,000", value: 25000 },
  { label: "50,000", value: 50000 },
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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
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
  })
  const [isDragging, setIsDragging] = useState(false)
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null)
  const [selectedSubgroup, setSelectedSubgroup] = useState<string | null>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

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
        const locationsPromise = supabase
          .from("locations2")
          .select("id, name, slug, parent_id, type")
          .order("name")

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

        if (!categoriesData || categoriesData.length === 0) {
          throw new Error("No categories found in the database")
        }

        if (!locationsData || locationsData.length === 0) {
          throw new Error("No locations found in the database")
        }

        // Get all regions (locations without parent_id)
        const regions = locationsData
          .filter(loc => !loc.parent_id)
          .sort((a, b) => a.name.localeCompare(b.name))

        // Process locations into hierarchy
        const processedLocations = regions.map(region => ({
          ...region,
          towns: locationsData
            .filter(loc => loc.parent_id === region.id)
            .map(town => ({
              ...town,
              quarters: locationsData.filter(loc => loc.parent_id === town.id)
            }))
        }))

        setCategories(categoriesData)
        setLocations(processedLocations)
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load categories and locations. Please try again.",
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
    }).reverse() // Reverse the order of files

    // Append new files to existing ones
    setSelectedFiles((prev) => [...prev, ...validFiles])
    
    // Reset the input value to allow selecting the same file again
    event.target.value = ""
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const updateFormData = (key: keyof FormData, value: string | number | string[]) => {
    if (key === 'price') {
      const numericValue = typeof value === 'string' 
        ? parseInt(value.replace(/[^0-9]/g, ''), 10) || 0
        : (typeof value === 'number' ? value : 0)
      setFormData((prev) => ({ ...prev, [key]: numericValue }))
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }))
    }
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

      // Log form data for debugging
      console.log('Form Data before submission:', {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        location_id: formData.location_id,
        price: formData.price,
        condition: formData.condition,
        address: formData.address,
        seller_id: session.user.id,
        images: selectedFiles.map(f => f.name)
      })

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
        console.log('Validation failed:', {
          hasTitle: !!formData.title,
          hasDescription: !!formData.description,
          hasCategoryId: !!formData.category_id,
          hasLocationId: !!formData.location_id,
          hasPrice: !!formData.price,
          hasCondition: !!formData.condition,
          hasFiles: selectedFiles.length > 0
        })
        throw new Error("Please fill in all required fields")
      }

      // Validate UUID format only for category_id and user_id
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidPattern.test(formData.category_id)) {
        throw new Error("Invalid category selected")
      }
      if (!uuidPattern.test(session.user.id)) {
        throw new Error("Invalid user ID")
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

      // Clean price value (remove any formatting)
      const cleanPrice = typeof formData.price === 'string' 
        ? parseInt(formData.price.replace(/[^0-9]/g, ''), 10)
        : formData.price

      // Create listing with all image URLs
      const { error: insertError, data: insertedListing } = await supabase
        .from("listings")
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: cleanPrice,
          category_id: formData.category_id,
          location_id: formData.location_id,
          address: formData.address?.trim() || null,
          seller_id: session.user.id,
          condition: formData.condition,
          images: imageUrls
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert Error:', insertError)
        throw new Error(insertError.message)
      }

      toast({
        title: "Success",
        description: "Your listing has been created successfully",
      })

      // Redirect to success page with listing ID
      router.push(`/listings/success?id=${insertedListing.id}`)
      router.refresh()
    } catch (error) {
      console.error('Submission Error:', error)
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
    }).reverse() // Reverse the order of files

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseInt(rawValue.replace(/\D/g, ''), 10) || 0;
    updateFormData("price", numericValue);
  };

  // Add this at the end of each step's content div, before the closing tag
  const navigationButtons = (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={handleBack} 
        disabled={currentStep === 1}
        className="w-[100px]"
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {currentStep < STEPS.length ? (
        <Button 
          onClick={handleNext} 
          disabled={!validateCurrentStep()}
          className="w-[100px]"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !validateCurrentStep()}
          className="w-[140px]"
        >
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
  )

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
    <div className="container max-w-6xl py-8">

      {/* Progress bar - make it more visible on mobile */}
      <div className="mb-8">
        <Progress value={(currentStep / STEPS.length) * 100} className="h-3" />
        <div className="flex justify-between mt-2 overflow-x-auto">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={cn(
                "text-sm whitespace-nowrap px-2",
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              )}
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
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                <div className="lg:col-span-4 space-y-1">
                  <Label htmlFor="title" className="text-xl font-semibold">
                    Title
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    As your listing storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours.
                  </p>
                </div>
                <div className="lg:col-span-8 space-y-2">
                  <Input
                    id="title"
                    placeholder="I will do something I'm really good at"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    className="text-lg"
                  />
                  <div className="flex justify-end">
                    <span className="text-sm text-muted-foreground">
                      {formData.title.length} / 80 max
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                <div className="lg:col-span-4 space-y-1">
                  <Label htmlFor="description" className="text-xl font-semibold">
                    Description
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Provide a detailed description of your listing. Include what buyers will receive, your expertise, and why they should choose your listing.
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <Textarea
                    id="description"
                    placeholder="Describe your listing in detail..."
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    className="min-h-[200px] lg:min-h-[300px] text-lg leading-relaxed"
                  />
                </div>
              </div>
            </div>
            {navigationButtons}
          </div>

          {/* Step 2: Category & Location */}
          <div className={cn(currentStep === 2 ? "block" : "hidden")}>
            <div className="space-y-8">
              {/* Category Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                <div className="lg:col-span-4 space-y-1">
                  <Label className="text-xl font-semibold">Category</Label>
                  <p className="text-muted-foreground text-sm">
                    Choose the category and sub-category most suitable for your listing.
                  </p>
                </div>
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <Label className="text-lg">Main Category</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mainCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedMainCategory(category.id)
                            setSelectedSubgroup(null)
                            updateFormData("category_id", "")
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm transition-colors",
                            "border hover:bg-primary hover:text-primary-foreground",
                            selectedMainCategory === category.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-muted-foreground/25",
                          )}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedMainCategory && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-lg">Subgroup</Label>
                        <Select
                          value={selectedSubgroup || ""}
                          onValueChange={(value) => {
                            setSelectedSubgroup(value)
                            updateFormData("category_id", "")
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subgroup" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter(cat => cat.parent_id === selectedMainCategory)
                              .map((subgroup) => {
                                // Get the last part after any dash or colon
                                const nameParts = subgroup.name.split(/[-:]/)
                                const cleanName = nameParts[nameParts.length - 1].trim()
                                return (
                                  <SelectItem key={subgroup.id} value={subgroup.id}>
                                    {cleanName}
                                  </SelectItem>
                                )
                              })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-lg">Category</Label>
                        <Select
                          value={formData.category_id}
                          onValueChange={(value) => updateFormData("category_id", value)}
                          disabled={!selectedSubgroup}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedSubgroup ? "Select a category" : "Select a subgroup first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .filter(cat => cat.parent_id === selectedSubgroup)
                              .map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                <div className="lg:col-span-4 space-y-1">
                  <Label className="text-xl font-semibold">Location</Label>
                  <p className="text-muted-foreground text-sm">
                    Select the location where your listing is available.
                  </p>
                </div>
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <Label className="text-lg">Region</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {locations.map((region) => (
                        <button
                          key={region.id}
                          onClick={() => {
                            setSelectedRegion(region.id)
                            setSelectedTown(null)
                            updateFormData("location_id", "")
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm transition-colors",
                            "border hover:bg-primary hover:text-primary-foreground",
                            selectedRegion === region.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-muted-foreground/25",
                          )}
                        >
                          {region.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedRegion && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-lg">Town</Label>
                        <Select
                          value={selectedTown || ""}
                          onValueChange={(value) => {
                            setSelectedTown(value)
                            updateFormData("location_id", "")
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a town" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations
                              .find(region => region.id === selectedRegion)
                              ?.towns?.map((town) => (
                                <SelectItem key={town.id} value={town.id}>
                                  {town.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-lg">Quarter</Label>
                        <Select
                          value={formData.location_id}
                          onValueChange={(value) => updateFormData("location_id", value)}
                          disabled={!selectedTown}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedTown ? "Select a quarter" : "Select a town first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {locations
                              .find(region => region.id === selectedRegion)
                              ?.towns?.find(town => town.id === selectedTown)
                              ?.quarters?.map((quarter) => (
                                <SelectItem key={quarter.id} value={quarter.id}>
                                  {quarter.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {navigationButtons}
          </div>

          {/* Step 3: Pricing & Condition */}
          <div className={cn(currentStep === 3 ? "block" : "hidden")}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                <div className="lg:col-span-4 space-y-1">
                  <Label htmlFor="price" className="text-xl font-semibold">
                    Price
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Set a competitive price for your listing.
                  </p>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  <Input
                    id="price"
                    type="text"
                    placeholder="Enter price in FCFA"
                    value={formData.price ? new Intl.NumberFormat('fr-FR').format(formData.price) : ''}
                    onChange={handlePriceChange}
                    className="text-lg"
                  />
                  <div>
                    <Label className="text-sm mb-2 block">Quick price options (FCFA)</Label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_PRICES.map((price) => (
                        <button
                          key={price.value}
                          onClick={() => updateFormData("price", price.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm transition-colors",
                            "border hover:bg-primary hover:text-primary-foreground",
                            formData.price === price.value
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-muted-foreground/25",
                          )}
                        >
                          {new Intl.NumberFormat('fr-FR').format(price.value)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                <div className="lg:col-span-4 space-y-1">
                  <Label className="text-xl font-semibold">Condition</Label>
                  <p className="text-muted-foreground text-sm">
                    Select the condition that best describes your item.
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map((condition) => (
                      <button
                        key={condition}
                        onClick={() => updateFormData("condition", condition)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm transition-colors",
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
            {navigationButtons}
          </div>

          {/* Step 4: Images */}
          <div className={cn(currentStep === 4 ? "block" : "hidden")}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <Label className="text-xl font-semibold">Images</Label>
                  <p className="text-muted-foreground text-sm">
                    Upload up to 5 high-quality images that showcase your listing.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Tips for great photos:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Use good lighting</li>
                    <li>Show multiple angles</li>
                    <li>Include size reference</li>
                    <li>Highlight key features</li>
                    <li>Keep images clear</li>
                  </ul>
                </div>
              </div>
              <div className="lg:col-span-8">
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {previewUrls.map((url, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square group border rounded-lg cursor-grab active:cursor-grabbing overflow-hidden"
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
                        <div className="absolute top-1 right-1 flex gap-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setLightboxImage(url)}
                          >
                            <ZoomIn className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="absolute bottom-1 left-1 text-white text-[10px] font-medium bg-black/60 px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {index === 0 ? 'Cover' : `${index + 1}`}
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
                          <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                          <span className="text-xs font-medium text-center">
                            Add {5 - selectedFiles.length} more
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
                      "h-48 border-2 border-dashed rounded-lg p-4 flex items-center justify-center",
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
                      <Upload className="h-6 w-8 mb-2 text-muted-foreground" />
                      <span className="text-base font-medium mb-1">Click to upload images</span>
                      <span className="text-sm text-muted-foreground">or drag and drop</span>
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
            {navigationButtons}
          </div>

          {/* Step 5: Review */}
          <div className={cn(currentStep === 5 ? "block" : "hidden")}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Images */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-lg font-medium">Images ({previewUrls.length})</h3>
                <div className="space-y-1.5">
                  {/* Cover Image */}
                  {previewUrls.length > 0 && (
                    <div 
                      className="relative aspect-[4/3] w-full group cursor-pointer"
                      onClick={() => setLightboxImage(previewUrls[0])}
                    >
                      <Image
                        src={previewUrls[0]}
                        alt="Cover Image"
                        fill
                        className="object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                      <div className="absolute top-1 right-1">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImage(previewUrls[0]);
                          }}
                        >
                          <ZoomIn className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="absolute bottom-1 left-1 text-white text-[10px] font-medium bg-black/60 px-1.5 py-0.5 rounded-sm">
                        Cover
                      </div>
                    </div>
                  )}

                  {/* Additional Images */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {previewUrls.slice(1).map((url, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-square group cursor-pointer"
                        onClick={() => setLightboxImage(url)}
                      >
                        <Image
                          src={url}
                          alt={`Image ${index + 2}`}
                          fill
                          className="object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                        <div className="absolute top-1 right-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxImage(url);
                            }}
                          >
                            <ZoomIn className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="absolute bottom-1 left-1 text-white text-[10px] font-medium bg-black/60 px-1.5 py-0.5 rounded-sm">
                          {index + 2}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold">Review Your Listing</h3>
                  <p className="text-muted-foreground text-sm">Please verify all details before submitting.</p>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    {/* Title */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">TITLE</Label>
                      <h4 className="text-lg font-medium mt-1">{formData.title}</h4>
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">DESCRIPTION</Label>
                      <div className="mt-1">
                        <div className={cn(
                          "text-sm whitespace-pre-line rounded-md",
                          !isDescriptionExpanded && "line-clamp-3"
                        )}>
                          {formData.description}
                        </div>
                        {formData.description.split('\n').length > 3 && (
                          <Button
                            variant="ghost"
                            className="mt-1 h-auto p-0 hover:bg-transparent"
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                          >
                            <span className="text-primary hover:underline text-xs">
                              {isDescriptionExpanded ? 'Show less' : 'Read more'}
                            </span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Price and Condition */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">PRICE</Label>
                        <p className="text-lg font-medium text-primary mt-1">
                          {new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: 'XAF',
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0
                          }).format(formData.price)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">CONDITION</Label>
                        <p className="text-base mt-1">{formData.condition}</p>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">CATEGORY</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-base">
                          {selectedMainCategory && categories.find((cat) => cat.id === selectedMainCategory)?.name}
                          {selectedMainCategory && selectedSubgroup && " → "}
                          {selectedSubgroup && categories.find((cat) => cat.id === selectedSubgroup)?.name}
                          {selectedSubgroup && formData.category_id && " → "}
                          {formData.category_id && categories.find((cat) => cat.id === formData.category_id)?.name}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">LOCATION</Label>
                      <div className="mt-1">
                        <p className="text-base">
                          {locations.find(region => region.id === selectedRegion)?.name}
                          {" → "}
                          {locations
                            .find(region => region.id === selectedRegion)
                            ?.towns?.find(town => town.id === selectedTown)?.name}
                          {" → "}
                          {locations
                            .find(region => region.id === selectedRegion)
                            ?.towns?.find(town => town.id === selectedTown)
                            ?.quarters?.find(quarter => quarter.id === formData.location_id)?.name}
                        </p>
                        {formData.address && (
                          <p className="text-sm text-muted-foreground mt-1">{formData.address}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {navigationButtons}
          </div>
        </CardContent>
      </Card>

      {/* Add Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full">
            <Image
              src={lightboxImage}
              alt="Enlarged preview"
              fill
              className="object-contain"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setLightboxImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
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


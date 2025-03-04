"use client"

import { useCallback, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Image as ImageIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  onRemove: (url: string) => void
}

export function ImageUpload({ value = [], onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClientComponentClient()

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true)
      const files = Array.from(e.target.files || [])

      // Validate file size and type
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Each image must be less than 5MB")
          return
        }
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are allowed")
          return
        }
      }

      // Upload each file
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `listings/${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from("listing_images")
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from("listing_images")
          .getPublicUrl(filePath)

        return publicUrl
      })

      const newUrls = await Promise.all(uploadPromises)
      onChange([...value, ...newUrls])
      toast.success("Images uploaded successfully")
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Failed to upload images")
    } finally {
      setIsUploading(false)
    }
  }, [value, onChange, supabase])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((url) => (
          <div key={url} className="group relative aspect-square">
            <Image
              src={url}
              alt="Listing image"
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onRemove(url)}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <label className="relative aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Upload Images</span>
              </>
            )}
          </div>
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        Upload up to 10 images. Each image must be less than 5MB.
      </p>
    </div>
  )
} 

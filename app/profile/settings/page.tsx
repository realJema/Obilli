"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  phone_number: string | null
  bio: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.push('/login')
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) throw error
        setProfile(profile)
      } catch (error) {
        toast.error('Error loading profile')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, router])

  const updateProfile = async (formData: FormData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const updates = {
        id: session.user.id,
        full_name: formData.get('full_name'),
        username: formData.get('username'),
        phone_number: formData.get('phone_number'),
        bio: formData.get('bio'),
        location: formData.get('location'),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.user.id)

      if (error) throw error
      toast.success('Profile updated successfully')
      router.refresh()
    } catch (error) {
      toast.error('Error updating profile')
      console.error('Error:', error)
    }
  }

  const uploadProfileImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      // Get current session first
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
      const allowedTypes = ['jpg', 'jpeg', 'png', 'gif']
      
      if (!allowedTypes.includes(fileExt)) {
        throw new Error('Invalid file type. Please upload a JPG, PNG, or GIF image.')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.')
      }

      // Create a unique file path using the user's ID and folder structure
      const folderPath = `public/${session.user.id}`
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${folderPath}/${fileName}`

      // Upload new profile image
      const { error: uploadError, data } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        throw updateError
      }
      
      setProfile(profile => profile ? { ...profile, avatar_url: publicUrl } : null)
      toast.success('Profile image uploaded successfully')
    } catch (error) {
      console.error('Full error:', error)
      toast.error(error instanceof Error ? error.message : 'Error uploading profile image')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-1/4 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-1/4 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <form action={updateProfile} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Update your profile information
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="space-y-4">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20">
                <Image
                  src={profile?.avatar_url || `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>')}`}
                  alt={profile?.full_name || 'Profile Image'}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <Button 
                  variant="outline" 
                  disabled={uploading}
                  className="relative"
                >
                  {uploading ? 'Uploading...' : 'Upload Profile Image'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={uploadProfileImage}
                    disabled={uploading}
                  />
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name || ''}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile?.username || ''}
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                defaultValue={profile?.phone_number || ''}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={profile?.location || ''}
                placeholder="Enter your location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile?.bio || ''}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
} 

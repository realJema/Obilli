"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

interface Profile {
  id: string
  username: string
  full_name: string
  bio: string | null
  avatar_url: string | null
  location: string | null
}

function SettingsContent() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setProfile(profile)
      } catch (error) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [supabase, router])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB')
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profile) return

    try {
      setSaving(true)
      const formData = new FormData(event.currentTarget)
      const updates: {
        username: string;
        full_name: string;
        bio: string;
        location: string;
        updated_at: string;
        avatar_url?: string;
      } = {
        username: formData.get('username') as string,
        full_name: formData.get('full_name') as string,
        bio: formData.get('bio') as string,
        location: formData.get('location') as string,
        updated_at: new Date().toISOString(),
      }

      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const filePath = `${profile.id}/${Date.now()}.${fileExt}`

        console.log('Uploading new avatar:', filePath)

        // Delete old avatar if exists
        if (profile.avatar_url) {
          try {
            const oldPath = new URL(profile.avatar_url).pathname.split('/').pop()
            if (oldPath) {
              console.log('Deleting old avatar:', oldPath)
              await supabase.storage
                .from('profile_images')
                .remove([`${profile.id}/${oldPath}`])
            }
          } catch (error) {
            console.error('Error deleting old avatar:', error)
          }
        }

        // Upload new avatar
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('profile_images')
          .upload(filePath, avatarFile)

        if (uploadError) {
          console.error('Error uploading avatar:', uploadError)
          throw uploadError
        }

        console.log('Upload successful:', uploadData)

        // Get public URL using Supabase method
        const { data: urlData } = supabase.storage
          .from('profile_images')
          .getPublicUrl(filePath)

        updates.avatar_url = urlData.publicUrl
        console.log('New avatar URL:', updates.avatar_url)
      }

      console.log('Updating profile with:', updates)

      // First update the profile
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating profile:', updateError)
        throw updateError
      }

      console.log('Profile update response:', updateData)

      // Double check the update worked
      const { data: checkProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .single()

      if (checkError) {
        console.error('Error checking profile update:', checkError)
        throw checkError
      }

      console.log('Final profile check:', checkProfile)

      // Update local state with the verified profile data
      setProfile(checkProfile)
      if (avatarFile) {
        setAvatarFile(null)
        setAvatarPreview(null)
      }

      toast.success('Profile updated successfully')
      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="space-y-2">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={avatarPreview || profile.avatar_url || undefined}
                alt={profile.full_name}
              />
              <AvatarFallback>
                {profile.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="max-w-[400px]"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username}
            required
          />
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name}
            required
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio || ''}
            rows={4}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={profile.location || ''}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense 
      fallback={
        <div className="container flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  )
}



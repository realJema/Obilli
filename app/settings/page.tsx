"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState<{ id: string; name: string; type: string }[]>([])
  const supabase = createClientComponentClient()

  // Fetch locations
  useEffect(() => {
    async function fetchLocations() {
      const { data } = await supabase
        .from("locations")
        .select("id, name, type")
        .order("name")
      
      if (data) {
        setLocations(data)
      }
    }

    fetchLocations()
  }, [supabase])

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth/sign-in")
    }
  }, [user, router, isLoading])

  if (!user || !profile) {
    return null
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
    const formData = new FormData(event.currentTarget)
      const updates = {
        full_name: formData.get("full_name") as string,
        username: formData.get("username") as string,
        bio: formData.get("bio") as string,
        location: formData.get("location") as string,
      }

      await updateProfile(updates)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Error updating profile")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split(".").pop()
      const filePath = `${user.id}/${Math.random()}.${fileExt}`

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      // Update the profile with the new avatar URL
      await updateProfile({ avatar_url: publicUrl })
      toast.success("Avatar updated successfully")
    } catch (error) {
      toast.error("Error updating avatar")
      console.error(error)
    }
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-muted bg-muted">
                      {profile.avatar_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <label htmlFor="avatar" className="absolute -right-2 -bottom-2">
                      <input
                        type="file"
                        id="avatar"
                        className="hidden"
                        accept="image/*"
                        onChange={onAvatarChange}
                      />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                        className="h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Upload avatar</span>
                    </Button>
                    </label>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">Profile Picture</h2>
                    <p className="text-sm text-muted-foreground">
                      Upload a new profile picture
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    defaultValue={profile.username}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile.full_name}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile.bio || ""}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Select name="location" defaultValue={profile.location || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter(loc => loc.type === "town")
                        .map(location => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">Email Address</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {user.email}
                </p>
                <Button variant="outline">Change Email</Button>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-lg font-medium mb-4">Password</h2>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-lg font-medium text-destructive mb-4">
                  Delete Account
                </h2>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="text-sm text-muted-foreground">
              Notification settings coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}



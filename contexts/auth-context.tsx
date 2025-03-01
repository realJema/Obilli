"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Database } from "@/lib/supabase/types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isProfileLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    userData: Omit<Profile, "id" | "created_at" | "updated_at">,
  ) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  isProfileLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const supabase = createClientComponentClient<Database>()

  // Query for session
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // Query for profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (profile) return profile

      // Create profile if it doesn't exist
      const baseUsername = session.user.email?.split("@")[0] || session.user.id.slice(0, 8)
      const newProfile = {
        id: session.user.id,
        username: baseUsername,
        full_name: session.user.user_metadata.full_name || "Anonymous User",
        avatar_url: null,
        bio: null,
        location: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data: createdProfile } = await supabase
        .from("profiles")
        .upsert([newProfile], { onConflict: "id" })
        .select()
        .single()

      return createdProfile
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  // Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["session"] })
      if (session?.user) {
        queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] })
      }
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, queryClient, router])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  async function signUp(email: string, password: string, userData: Omit<Profile, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
        },
      },
    })

    if (error) throw error
    if (!data.user) throw new Error("No user returned from sign up")
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    queryClient.clear()
    router.push("/")
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!session?.user) throw new Error("No user logged in")

    // Optimistically update the profile
    queryClient.setQueryData(["profile", session.user.id], (old: Profile | undefined) => ({
      ...old,
      ...updates,
      updated_at: new Date().toISOString(),
    }))

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id)

      if (error) throw error

      // Invalidate to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] })
    } catch (error) {
      // Rollback optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        profile: profile || null,
        isLoading: isSessionLoading,
        isProfileLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


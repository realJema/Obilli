"use client"

import Link from "next/link"
import { useRouter } from "next/navigation" // Using Next.js App Router
import { useAuth } from "@/contexts/auth-context"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { MainNav } from "@/components/main-nav"

export function Header() {
  const router = useRouter()
  const { user, profile, isLoading } = useAuth()

  // Only show loading spinner when session is being initialized
  if (isLoading) {
    return (
      <header>
        <div className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-600">
              Obilli
            </Link>
            <div className="hidden flex-1 items-center justify-center px-12 lg:flex">
              <SearchBar />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-green-600 animate-spin" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header>
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-green-600">
            Obilli
          </Link>
          <div className="hidden flex-1 items-center justify-center px-12 lg:flex">
            <SearchBar />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/listings/create" passHref>
                  <Button className="gap-2 bg-green-600 hover:bg-green-700 text-lg text-white">
                    <PlusCircle className="h-4 w-4" />
                    Create Listing
                  </Button>
                </Link>
                <UserMenu user={user} profile={profile} />
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" passHref>
                  <Button variant="ghost" className="text-lg">Sign In</Button>
                </Link>
                <Link href="/auth/sign-up" passHref>
                  <Button className="bg-green-600 hover:bg-green-700 text-lg">Join</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <MainNav />
    </header>
  )
}


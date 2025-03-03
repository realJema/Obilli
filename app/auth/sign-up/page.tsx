"use client"

import type React from "react"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const username = formData.get("username") as string
    const fullName = formData.get("name") as string
    const phoneNumber = formData.get("phone") as string

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      await signUp(email, password, {
        username,
        full_name: fullName,
        avatar_url: null,
        bio: null,
        location: null,
        phone_number: phoneNumber
      })

      // Redirect to homepage after successful registration and auto-login
      router.push("/")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative min-h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-green-600" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            Obilli
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">"Join our community of buyers and sellers. Start your journey with Obilli today!"</p>
            <footer className="text-sm">John Smith</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
          <div className="flex flex-col space-y-1.5 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-base text-muted-foreground">Enter your details below to create your account</p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-base">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="John Smith" 
                  type="text" 
                  disabled={isLoading} 
                  required 
                  className="text-base h-12"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="username" className="text-base">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johnsmith"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                  className="text-base h-12"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone" className="text-base">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+237 6XX XXX XXX"
                  type="tel"
                  disabled={isLoading}
                  required
                  className="text-base h-12"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  title="Please enter a valid email address"
                  className="text-base h-12"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password" className="text-base">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    required
                    className="text-base h-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-base">{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" disabled={isLoading} className="text-base h-12">
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
          <div className="text-center text-base">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense 
      fallback={
        <div className="container flex items-center justify-center min-h-[800px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  )
}


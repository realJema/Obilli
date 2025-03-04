import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    // Create a response to modify
    const res = NextResponse.next()
    
    // Create a Supabase client with both request and response
    const supabase = createMiddlewareClient({ 
      req: request,
      res,
    })

    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession()

    // Protected routes
    const protectedPaths = [
      "/listings/create", 
      "/settings",
      "/profile/settings",
      "/profile/edit",
      "/profile"
    ]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    // Auth routes
    const authPaths = ["/auth/sign-in", "/auth/sign-up"]
    const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !session) {
      const redirectUrl = new URL("/auth/sign-in", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect to home if accessing auth pages while logged in
    if (session && isAuthPath) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Return the response with the session
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // On error, allow access to public routes but redirect to login for protected routes
    const isProtectedPath = ["/listings/create", "/settings", "/profile"].some((path) => 
      request.nextUrl.pathname.startsWith(path)
    )
    
    if (isProtectedPath) {
      const redirectUrl = new URL("/auth/sign-in", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    return NextResponse.next()
  }
}

// Update the matcher configuration to include all routes that need session handling
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


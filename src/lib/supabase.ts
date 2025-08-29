import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createClientClient = () =>
  createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

// Server-side Supabase client for Server Components
export const createServerClient = () =>
  createServerComponentClient({
    cookies: () => cookies(),
  })

// Server-side Supabase client for API routes
export const createRouteClient = () =>
  createRouteHandlerClient({
    cookies: () => cookies(),
  })

// Admin client for server-side operations
export const createAdminClient = () =>
  createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

// Database types (will be generated)
export type Database = {
  public: {
    Tables: {
      // Will be populated after schema creation
    }
  }
}
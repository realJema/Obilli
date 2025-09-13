import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/types/database';

// Create a simple client that works in both environments (mainly for read operations)
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Client-side auth-enabled client factory
export function createSupabaseClient() {
  return createClientComponentClient<Database>();
}

// Get auth-aware client for client-side operations that require user context
export function getAuthClient() {
  if (typeof window !== 'undefined') {
    return createClientComponentClient<Database>();
  }
  return supabase; // Fallback for server-side
}

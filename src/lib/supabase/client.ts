
"use client"

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/database.types'; // You'll need to generate this type

// Define a function to create a Supabase client for client-side operations
// Ensure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local
export function createSupabaseClientComponentClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Consider throwing an error or logging a more specific warning
    // For now, returning a potentially non-functional client if env vars are missing
    console.warn("Supabase URL or Anon Key is missing. Client-side Supabase functionality may be impaired.");
  }
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

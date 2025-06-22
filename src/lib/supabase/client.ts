
"use client"

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/database.types';

export function createSupabaseClientComponentClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.trim() === '' || supabaseAnonKey.trim() === '') {
    // This will be caught by the nearest Error Boundary.
    // It's better than crashing with a cryptic "Invalid URL" message.
    throw new Error("CRITICAL ERROR: Missing Supabase credentials in client environment. Check hosting provider's settings for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}

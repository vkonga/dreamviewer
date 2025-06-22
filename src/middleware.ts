import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isValidSupabaseConfig = 
    supabaseUrl && supabaseUrl.trim() !== "" &&
    supabaseAnonKey && supabaseAnonKey.trim() !== "";

  if (!isValidSupabaseConfig) {
    console.error(
      "CRITICAL: Supabase URL or Anon Key is missing or empty in middleware. " +
      "Authentication and Supabase-dependent features will not function correctly. " +
      "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file and the server is restarted."
    );
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl, 
    supabaseAnonKey, 
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/static') || 
    pathname.endsWith('.ico') || 
    pathname.endsWith('.png') || 
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp')
  ) {
    return response;
  }

  const protectedPaths = ['/dashboard', '/dreams', '/profile'];
  if (!session && protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If user is authenticated and tries to access /auth, redirect to /dashboard
  if (session && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|static|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp)$).*)',
  ],
}

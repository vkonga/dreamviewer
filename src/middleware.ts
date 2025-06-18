
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if Supabase environment variables are defined and not empty
  const isValidSupabaseConfig = 
    supabaseUrl && supabaseUrl.trim() !== "" &&
    supabaseAnonKey && supabaseAnonKey.trim() !== "";

  if (!isValidSupabaseConfig) {
    console.error(
      "CRITICAL: Supabase URL or Anon Key is missing or empty in middleware. " +
      "Authentication and Supabase-dependent features will not function correctly. " +
      "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file and the server is restarted."
    );
    // Allow the request to proceed. The layout.tsx should catch this for page renders and show an error UI.
    // For API routes or other non-UI paths, this might mean they operate without Supabase context.
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl, // Use the validated and non-null supabaseUrl
    supabaseAnonKey, // Use the validated and non-null supabaseAnonKey
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          // Ensure the response object is updated when cookies are set
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
           // Ensure the response object is updated when cookies are removed
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // IMPORTANT: Avoid running middleware on API routes, static files, and _next paths
  // to prevent infinite loops or unintended behavior.
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/static') || // if you have a /static folder
    pathname.endsWith('.ico') || // common icons
    pathname.endsWith('.png') || // common image types
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp')
  ) {
    return response;
  }

  // Refresh session if expired - important to do before
  // accessing `getSession()` to ensure it's accurate.
  const { data: { session } } = await supabase.auth.getSession();

  // Basic route protection:
  // If trying to access protected routes and no session, redirect to /auth
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - static (custom static folder)
     * - various image and icon extensions
     * This ensures middleware runs on page navigations.
     */
    '/((?!api|_next/static|_next/image|static|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp)$).*)',
  ],
}


import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // The try/catch block is a safeguard against the app crashing if the env vars are missing or invalid.
  // The RootLayout component will handle displaying a user-friendly error message.
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
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
  } catch (e) {
    // If createServerClient fails, it's likely due to invalid env vars.
    // We'll just return the original response and let the RootLayout handle the error display.
    return response;
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|static|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp)$).*)',
  ],
}

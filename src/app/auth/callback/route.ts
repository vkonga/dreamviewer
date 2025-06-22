
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// This route is responsible for exchanging an auth code for a session.
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  
  if (error) {
    // If there's an error from Google or the user denies access, redirect to the auth page with the error message
    const errorMessage = "Authentication failed. " + error;
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(errorMessage)}`, request.url));
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("Auth callback error:", exchangeError.message);
      // If the exchange fails, redirect to auth page with a more specific error
      const errorMessage = "Could not authenticate user. " + exchangeError.message;
      return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(errorMessage)}`, request.url));
    }
  }

  // URL to redirect to after sign in process completes successfully
  // Reconstructing the URL this way is more robust than using `origin`.
  return NextResponse.redirect(new URL('/dashboard', request.url));
}

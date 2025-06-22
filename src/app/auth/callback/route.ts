
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// This route is responsible for exchanging an auth code for a session.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    // If there's an error from Google or the user denies access, redirect to the auth page with the error message
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error)}`);
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
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent("Could not authenticate user. " + exchangeError.message)}`);
    }
  }

  // URL to redirect to after sign in process completes successfully
  return NextResponse.redirect(`${origin}/dashboard`);
}

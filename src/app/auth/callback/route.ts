
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

// This route is responsible for exchanging an auth code for a session.
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  if (error) {
    // If there's an error, redirect to the auth page with an error message
    return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = createSupabaseServerClient();
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoonStar, LogIn, UserPlus, LogOutIcon, LayoutDashboardIcon, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createSupabaseClientComponentClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { logoutUser } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseClientComponentClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session state
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getInitialSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false); // Ensure loading is false after any auth event
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]); // Effect only depends on supabase client instance

  const handleLogout = async () => {
    setLoading(true); 
    const result = await logoutUser();
    if (result.success) {
      toast({ title: "Logged Out", description: result.message });
      // setUser(null) will be handled by onAuthStateChange
      router.push("/auth"); 
    } else {
      toast({ title: "Logout Failed", description: result.message, variant: "destructive" });
    }
    // setLoading(false) will be handled by onAuthStateChange if session becomes null
    // or if user navigates away and component re-evaluates loading state
  };

  const isAuthPage = pathname === '/auth' || pathname === '/auth/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" aria-label="DreamView Home">
          <MoonStar className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">DreamView</span>
        </Link>
        
        {!isAuthPage && (
          <nav className="flex items-center space-x-2">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboardIcon className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth?mode=signup">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

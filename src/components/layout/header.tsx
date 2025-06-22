
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
import { cn } from "@/lib/utils";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseClientComponentClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    setLoading(true); 
    const result = await logoutUser();
    if (result.success) {
      toast({ title: "Logged Out", description: result.message });
      router.push("/auth"); 
    } else {
      toast({ title: "Logout Failed", description: result.message, variant: "destructive" });
    }
  };

  const isAuthPage = pathname === '/auth' || pathname === '/auth/';
  const isHomePage = pathname === '/';

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full border-b",
      isHomePage 
        ? "bg-transparent border-transparent" 
        : "border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" aria-label="DreamView Home">
          <MoonStar className={cn("h-7 w-7", isHomePage ? "text-white" : "text-primary")} />
          <span className={cn(
            "font-headline text-2xl font-bold",
            isHomePage ? "text-white" : "text-foreground"
          )}>Dream View</span>
        </Link>
        
        {!isAuthPage && (
          <nav className="flex items-center space-x-2">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <>
                <Button variant="ghost" asChild className={isHomePage ? "text-white hover:bg-white/10 hover:text-white" : ""}>
                  <Link href="/dashboard">
                    <LayoutDashboardIcon className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                   className={cn("border-white/50 bg-transparent hover:bg-white/10 hover:text-white", isHomePage ? "text-white" : "text-foreground")}
                >
                  <LogOutIcon className="mr-2 h-4 w-4" /> Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className={isHomePage ? "text-white hover:bg-white/10 hover:text-white" : ""}>
                  <Link href="/auth">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button asChild variant={isHomePage ? "outline" : "default"} className={cn("border-white/50 bg-white/10 hover:bg-white/20", isHomePage ? "text-white" : "")}>
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

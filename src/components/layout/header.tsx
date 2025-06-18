
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoonStar, LogIn, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";

// Mock auth state - replace with real auth context/hook
const useMockAuth = () => {
  if (typeof window !== 'undefined') {
    return { isAuthenticated: localStorage.getItem("isMockAuthenticated") === "true" };
  }
  return { isAuthenticated: false };
};


export function AppHeader() {
  const { isAuthenticated } = useMockAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === '/auth';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" aria-label="DreamView Home">
          <MoonStar className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">DreamView</span>
        </Link>
        
        {!isAuthPage && (
          <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem("isMockAuthenticated");
                    }
                    // Simulate logout: Ideally, this would use router.push after state update.
                    // For now, a simple reload or navigation.
                    window.location.href = '/';
                  }}
                >
                  Log Out
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

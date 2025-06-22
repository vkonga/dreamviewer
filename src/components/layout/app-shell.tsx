
"use client";
import React, { useEffect, useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Button } from "../ui/button";
import { Loader2, PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { createSupabaseClientComponentClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(isMobile ? false : true);
  const supabase = createSupabaseClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoadingAuth(false);
      if (!session) {
        router.push('/auth');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
      if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
        router.refresh(); // Refresh to clear server component cache before redirect
        router.push('/auth');
      } else if (event === 'SIGNED_IN') {
        router.refresh(); // Refresh to ensure server components have the new session
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, router]);
  
  if (loadingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        <p className="text-foreground ml-2">Loading authentication...</p>
      </div>
    );
  }

  if (!user && !loadingAuth) { 
    return (
         <div className="flex h-screen w-screen items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            <p className="text-foreground ml-2">Redirecting...</p>
        </div>
    );
  }


  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} defaultOpen={!isMobile}>
      <Sidebar side="left" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
        <SidebarNav user={user} />
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          <div className="md:hidden">
            {/* Corrected usage of SidebarTrigger: Pass props directly, remove asChild and Button child */}
            <SidebarTrigger variant="outline" size="icon" />
          </div>
          <div className="flex-1">
            {/* Breadcrumbs or page titles */}
          </div>
          {/* User Profile Dropdown could go here, using `user` state */}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DreamView. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}


"use client";
import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Button } from "../ui/button";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(isMobile ? false : true);

  // Effect to handle mock authentication check
  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem("isMockAuthenticated") !== "true") {
      window.location.href = '/auth'; // Redirect to auth if not "logged in"
    }
  }, []);
  
  // Render null or a loading state while checking auth to prevent flash of content
  if (typeof window !== 'undefined' && localStorage.getItem("isMockAuthenticated") !== "true") {
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><p className="text-foreground">Loading...</p></div>;
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} defaultOpen={!isMobile}>
      <Sidebar side="left" variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
        <SidebarNav />
        {!isMobile && <SidebarRail />}
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
          {/* Mobile sidebar trigger needs to be part of the main content flow */}
          <div className="md:hidden">
            <SidebarTrigger asChild>
              <Button variant="outline" size="icon">
                <PanelLeft />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
          </div>
          <div className="flex-1">
            {/* You can add breadcrumbs or page titles here */}
          </div>
          {/* Add User Profile Dropdown here if needed */}
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


"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MoonStar, LayoutDashboard, BookOpen, UserCircle, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { logoutUser } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dreams", label: "Dream Journal", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

interface SidebarNavProps {
  user: SupabaseUser | null; // Pass user from AppShell
}


export function SidebarNav({ user }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useSidebar();
  const { toast } = useToast();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      toast({ title: "Logged Out", description: result.message });
      router.push('/auth'); // Redirect to auth page
      router.refresh(); // Ensures server components and layouts update
    } else {
      toast({ title: "Logout Failed", description: result.message, variant: "destructive" });
    }
  };


  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2" aria-label="DreamView Home">
          <MoonStar className="h-8 w-8 text-primary" />
          {open && <span className="font-headline text-xl font-semibold text-foreground">DreamView</span>}
        </Link>
      </SidebarHeader>
      <Separator className="my-0" />
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: "right", className: "bg-popover text-popover-foreground" }}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="my-0" />
      <SidebarFooter className="p-4">
        {user && (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
            aria-label="Log Out"
          >
            <LogOut className="h-5 w-5" />
            {open && <span>Log Out</span>}
          </Button>
        )}
      </SidebarFooter>
    </>
  );
}

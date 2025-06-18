
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MoonStar, LayoutDashboard, BookOpen, UserCircle, LogOut, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dreams", label: "Dream Journal", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center" aria-label="DreamView Dashboard">
            <MoonStar className="h-8 w-8 text-primary" />
          </Link>
          {open && <span className="font-headline text-xl font-semibold">DreamView</span>}
        </div>
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
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem("isMockAuthenticated");
            }
            window.location.href = '/auth';
          }}
          aria-label="Log Out"
        >
          <LogOut className="h-5 w-5" />
          {open && <span>Log Out</span>}
        </Button>
      </SidebarFooter>
    </>
  );
}

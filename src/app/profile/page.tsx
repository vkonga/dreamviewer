
"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/lib/definitions";

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<Partial<User>>({ username: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate fetching user data
    setIsLoading(true);
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("mockUser");
        if (storedUser) {
            try {
                const parsedUser: User = JSON.parse(storedUser);
                setUser({ username: parsedUser.username || "Dreamer", email: parsedUser.email || "user@example.com" });
            } catch (e) {
                console.error("Failed to parse user data:", e);
                setUser({ username: "Dreamer", email: "user@example.com" }); // Fallback
            }
        } else {
           setUser({ username: "Dreamer", email: "user@example.com" }); // Fallback
        }
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (typeof window !== 'undefined' && user.username && user.email) {
        localStorage.setItem("mockUser", JSON.stringify({ ...JSON.parse(localStorage.getItem("mockUser") || "{}"), username: user.username, email: user.email }));
    }
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    setIsSaving(false);
  };
  
  if (isLoading) {
    return <AppShell><div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div></AppShell>;
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">Profile Management</h1>
          <p className="text-lg text-muted-foreground">Update your account details.</p>
        </div>
        <Separator />
        <Card className="bg-card/90 shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Information</CardTitle>
              <CardDescription>Keep your profile up-to-date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={user.username} onChange={handleInputChange} placeholder="Your username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input id="password" type="password" placeholder="New password (optional)" />
                <p className="text-xs text-muted-foreground">Leave blank if you don't want to change it.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}

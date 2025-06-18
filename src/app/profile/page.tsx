
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
import { createSupabaseClientComponentClient } from "@/lib/supabase/client";
import { updateUserProfile } from "@/lib/actions";
import type { UserMetadata } from "@/lib/supabase/database.types";

interface ProfileFormState {
  username: string;
  email: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const supabase = createSupabaseClientComponentClient();
  const [profile, setProfile] = useState<ProfileFormState>({ username: "", email: "" });
  const [initialProfile, setInitialProfile] = useState<ProfileFormState>({ username: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userMetadata = user.user_metadata as UserMetadata;
        const currentProfile = {
          email: user.email || "",
          username: userMetadata?.username || user.email?.split('@')[0] || "",
        };
        setProfile(currentProfile);
        setInitialProfile(currentProfile);
      } else {
        // Handle case where user is not found, though middleware should protect this page
        toast({ title: "Error", description: "Could not load user profile.", variant: "destructive" });
      }
      setIsLoading(false);
    }
    fetchUserProfile();
  }, [supabase, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const updates: { username?: string; email?: string } = {};
    if (profile.username !== initialProfile.username) {
      updates.username = profile.username;
    }
    // Email update is more complex due to confirmation, handle with care or disallow for now
    // For simplicity, this example focuses on username. If email changes, Supabase handles confirmation.
    if (profile.email !== initialProfile.email) {
        updates.email = profile.email; 
    }

    if (Object.keys(updates).length > 0) {
        const result = await updateUserProfile(updates);
        if (result.success) {
            toast({ title: "Profile Updated", description: result.message });
            setInitialProfile(profile); // Update initial state to reflect saved changes
        } else {
            toast({ title: "Update Failed", description: result.message, variant: "destructive" });
        }
    }


    if (newPassword) {
      const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
      if (passwordError) {
        toast({ title: "Password Update Failed", description: passwordError.message, variant: "destructive" });
      } else {
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
        setNewPassword(""); // Clear password field
      }
    }
    
    if (Object.keys(updates).length === 0 && !newPassword) {
        toast({ title: "No Changes", description: "No information was changed." });
    }

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
              <CardDescription>Keep your profile up-to-date. Email changes may require confirmation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={profile.username} onChange={handleInputChange} placeholder="Your username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Input id="password" type="password" value={newPassword} onChange={handlePasswordChange} placeholder="New password (optional)" />
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

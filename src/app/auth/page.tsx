
"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/layout/header";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser, registerUser } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createSupabaseClientComponentClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>;

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type RegisterFormData = z.infer<typeof registerSchema>;

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createSupabaseClientComponentClient();
  
  const initialTab = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/dashboard"); // Redirect if user becomes authenticated
      }
    });

    // Check initial auth state
    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            router.push("/dashboard");
        }
    };
    checkInitialSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase]);


  const onLogin: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    const result = await loginUser({ email: data.email, password_DO_NOT_USE: data.password });
    setIsLoading(false);
    if (result.success) {
      toast({ title: "Login Successful", description: result.message });
      router.push("/dashboard"); // Supabase session will be handled by middleware/AppShell
      router.refresh(); // Force re-render of layout to pick up new auth state
    } else {
      toast({ title: "Login Failed", description: result.message, variant: "destructive" });
    }
  };

  const onRegister: SubmitHandler<RegisterFormData> = async (data) => {
    setIsLoading(true);
    const result = await registerUser({ email: data.email, password_DO_NOT_USE: data.password, username: data.username });
    setIsLoading(false);
    if (result.success) {
      toast({ title: "Registration Attempted", description: result.message }); // Message might include "check email"
      resetSignup();
      // Don't automatically switch to login tab if email confirmation is needed.
      // Let the user decide or handle redirection based on Supabase flow.
      // setActiveTab("login"); 
    } else {
      toast({ title: "Registration Failed", description: result.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    resetLogin();
    resetSignup();
  }, [activeTab, resetLogin, resetSignup]);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md animate-fade-in">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="bg-card shadow-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your dream journal.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLoginSubmit(onLogin)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="you@example.com" {...registerLogin("email")} />
                    {loginErrors.email && <p className="text-sm text-destructive">{loginErrors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...registerLogin("password")} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {loginErrors.password && <p className="text-sm text-destructive">{loginErrors.password.message}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                  <Button variant="link" size="sm" className="text-accent">Forgot Password?</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="bg-card shadow-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Create Account</CardTitle>
                <CardDescription>Join DreamView and start exploring your dreams.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignupSubmit(onRegister)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input id="signup-username" placeholder="YourUsername" {...registerSignup("username")} />
                    {signupErrors.username && <p className="text-sm text-destructive">{signupErrors.username.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="you@example.com" {...registerSignup("email")} />
                    {signupErrors.email && <p className="text-sm text-destructive">{signupErrors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                     <div className="relative">
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...registerSignup("password")} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    {signupErrors.password && <p className="text-sm text-destructive">{signupErrors.password.message}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}>
      <AuthForm />
    </Suspense>
  );
}

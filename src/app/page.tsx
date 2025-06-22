import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/layout/header";
import Link from "next/link";
import Image from "next/image";
import { BrainCircuit, ImageIcon, MessagesSquare, CalendarClock, Star, Twitter, Instagram, Youtube, Languages } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-center text-white hero-background">
          <div className="relative z-10 container flex flex-col items-center animate-fade-in px-4">
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4 flex items-center gap-4">
              Dream View <span className="text-3xl md:text-5xl">🌠</span>
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto text-balance">
              Your Dreams, Visualized. Your Memories, Preserved.
            </p>
            <p className="text-lg text-white/80 mb-10 max-w-2xl">
              Imagine, Create, and Connect — with the power of AI and a touch of magic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary/80 text-primary-foreground hover:bg-primary backdrop-blur-sm border border-primary/50 shadow-lg hover:shadow-primary/40 transition-all hover:scale-105 px-8 py-6 text-lg">
                <Link href="/dashboard">Launch Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-background/20 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm shadow-lg transition-all hover:scale-105 px-8 py-6 text-lg">
                <a href="#ai-assistant">Try Dream Assistant</a>
              </Button>
            </div>
          </div>
        </section>

        {/* AI Assistant Preview */}
        <section id="ai-assistant" className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Meet Your Dream Assistant</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Your personal AI assistant helps you organize your dreams, generate stunning visuals, create guided memories, and assist with life planning.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="flex flex-col items-center">
                <BrainCircuit className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Suggestions</h3>
              </div>
              <div className="flex flex-col items-center">
                <ImageIcon className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Dream-to-Image</h3>
              </div>
              <div className="flex flex-col items-center">
                <MessagesSquare className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Personalized Guidance</h3>
              </div>
              <div className="flex flex-col items-center">
                <CalendarClock className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Dream Planner</h3>
              </div>
            </div>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-secondary/30 transition-shadow">
              Chat Now
            </Button>
          </div>
        </section>
        
        {/* Image Generator Section */}
        <section className="py-20 md:py-32 bg-muted/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom mask-image-radial-fade"></div>
            <div className="container mx-auto px-4 text-center relative">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Imagine It. See It.</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Use prompts to generate breathtaking AI visuals of your dream world.</p>
                <div className="max-w-2xl mx-auto flex gap-2 mb-12">
                    <Input placeholder="Describe your dream (e.g. “A floating city at sunrise”)..." className="text-lg p-6"/>
                    <Button size="lg" className="text-lg p-6">Generate Image</Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Image src="https://placehold.co/400x600.png" alt="Generated dream 1" width={400} height={600} className="rounded-lg shadow-xl hover:scale-105 transition-transform" data-ai-hint="fantasy castle"/>
                    <Image src="https://placehold.co/400x600.png" alt="Generated dream 2" width={400} height={600} className="rounded-lg shadow-xl hover:scale-105 transition-transform" data-ai-hint="underwater city"/>
                    <Image src="https://placehold.co/400x600.png" alt="Generated dream 3" width={400} height={600} className="rounded-lg shadow-xl hover:scale-105 transition-transform" data-ai-hint="space whales"/>
                    <Image src="https://placehold.co/400x600.png" alt="Generated dream 4" width={400} height={600} className="rounded-lg shadow-xl hover:scale-105 transition-transform" data-ai-hint="cyberpunk street"/>
                </div>
            </div>
        </section>

        {/* Dashboard Sneak Peek */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Your Personalized Dream Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              All your generated images, ideas, assistant chats, and progress in one calming control center.
            </p>
            <div className="max-w-5xl mx-auto p-4 md:p-8 rounded-xl border bg-muted/30 shadow-2xl">
              <Image src="https://placehold.co/1200x600.png" alt="Dashboard preview" width={1200} height={600} className="rounded-lg" data-ai-hint="dashboard ui"/>
            </div>
             <Button size="lg" asChild className="mt-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/30">
                <Link href="/dashboard">Launch Dashboard</Link>
              </Button>
          </div>
        </section>

        {/* Upcoming Feature: Family Tree */}
        <section className="py-20 md:py-32 bg-muted/20">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 text-center lg:text-left">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Build Your Legacy with the Dream Tree</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Store, organize, and connect family memories—photos, videos, voice notes, and stories. Link them across generations with an interactive, living family tree.
                    </p>
                    <ul className="space-y-2 text-left mb-8 list-inside list-disc marker:text-secondary">
                        <li>Add family members as branches</li>
                        <li>Attach memories to each person</li>
                        <li>AI-curated timelines and albums</li>
                    </ul>
                    <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">Notify Me When Live</Button>
                </div>
                <div className="lg:w-1/2">
                    <Image src="https://placehold.co/600x600.png" alt="Family Tree" width={600} height={600} className="rounded-full shadow-2xl" data-ai-hint="glowing tree"/>
                </div>
            </div>
        </section>

        {/* Subscription Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto text-center bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/50 shadow-2xl shadow-secondary/10">
              <CardHeader>
                <CardTitle className="font-headline text-4xl">Unlock the Full Dream Experience</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  <span className="text-4xl font-bold text-white">$4.99</span> / month
                </CardDescription>
              </CardHeader>
              <CardContent className="text-left space-y-3">
                <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Unlimited Image Generation</p>
                <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Access to Dream Assistant</p>
                <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Personalized Dashboard</p>
                <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Early Access to Family Tree</p>
                <p className="flex items-center gap-2"><Star className="h-5 w-5 text-primary"/> Cloud Memory Storage</p>
              </CardContent>
              <CardFooter>
                 <Button size="lg" className="w-full text-lg mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/40">Subscribe Now</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 md:py-32 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card">
                  <CardContent className="pt-6">
                      <p className="text-lg italic mb-4">"Feels like I’ve visualized my thoughts for the first time.”</p>
                      <p className="font-semibold text-right text-primary">– Priya, India</p>
                  </CardContent>
              </Card>
              <Card className="bg-card">
                  <CardContent className="pt-6">
                      <p className="text-lg italic mb-4">“The family tree feature will be a blessing for our legacy.”</p>
                      <p className="font-semibold text-right text-primary">– James, USA</p>
                  </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-card border-t border-border/50 py-12">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
                <div className="flex justify-center gap-6 mb-6">
                    <Link href="#" className="hover:text-primary">About</Link>
                    <Link href="#" className="hover:text-primary">Terms</Link>
                    <Link href="#" className="hover:text-primary">Privacy</Link>
                </div>
                <div className="flex justify-center gap-6 mb-8">
                    <Link href="#" aria-label="Instagram"><Instagram className="h-6 w-6 hover:text-primary"/></Link>
                    <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 hover:text-primary"/></Link>
                    <Link href="#" aria-label="Youtube"><Youtube className="h-6 w-6 hover:text-primary"/></Link>
                </div>
                <div className="flex justify-center items-center gap-2 mb-8">
                    <Languages className="h-5 w-5"/>
                    <select className="bg-transparent border-none text-muted-foreground hover:text-primary focus:ring-0">
                        <option>English</option>
                        <option>Español</option>
                        <option>Français</option>
                    </select>
                </div>
                <p>© Dream View, 2025</p>
            </div>
        </footer>
      </main>
    </div>
  );
}

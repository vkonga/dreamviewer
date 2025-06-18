
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AppHeader } from "@/components/layout/header";
import { Sparkles, BookText, BarChart3, Users, MoonStar } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 text-center bg-gradient-to-br from-background to-muted animate-fade-in">
          <div className="absolute inset-0 opacity-10">
             {/* Subtle background pattern or image could go here */}
          </div>
          <div className="container relative z-10">
            <MoonStar className="mx-auto h-24 w-24 text-primary mb-6 animate-pulse" />
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-balance">
              Unlock the World of Your Dreams
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto text-balance">
              DreamView helps you record, understand, and explore the fascinating landscape of your subconscious.
            </p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
              <Link href="/dreams">Start Your Dream Journal</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container">
            <h2 className="font-headline text-4xl font-bold text-center mb-12">Why DreamView?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BookText,
                  title: "Private Dream Journal",
                  description: "Securely record your dreams with our intuitive editor. Your thoughts are safe and private.",
                  dataAiHint: "journal book"
                },
                {
                  icon: Sparkles,
                  title: "AI-Powered Analysis",
                  description: "Gain insights into symbols, themes, and emotions with our advanced AI interpretation engine.",
                  dataAiHint: "artificial intelligence"
                },
                {
                  icon: BarChart3,
                  title: "Personalized Dashboard",
                  description: "Visualize your dream patterns, track recurring themes, and understand your dream history over time.",
                  dataAiHint: "data charts"
                },
              ].map((feature, index) => (
                <Card key={index} className="text-center bg-card shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-slide-in-up" style={{animationDelay: `${index * 150}ms`}}>
                  <CardHeader>
                    <feature.icon className="mx-auto h-12 w-12 text-accent mb-4" />
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <div className="mt-4 h-40 w-full relative overflow-hidden rounded-md">
                       <Image src={`https://placehold.co/400x250.png`} alt={feature.title} layout="fill" objectFit="cover" data-ai-hint={feature.dataAiHint} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section (Placeholder) */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container">
            <h2 className="font-headline text-4xl font-bold text-center mb-12">Loved by Dreamers</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  quote: "DreamView has transformed how I interact with my dreams. The AI insights are mind-blowing!",
                  author: "Alex P.",
                  avatar: "https://placehold.co/100x100.png",
                  dataAiHint: "person smiling"
                },
                {
                  quote: "Finally, a beautiful and secure place to keep my dream journal. The dashboard is fantastic for spotting patterns.",
                  author: "Jamie L.",
                  avatar: "https://placehold.co/100x100.png",
                  dataAiHint: "woman thinking"
                },
              ].map((testimonial, index) => (
                 <Card key={index} className="bg-card shadow-lg animate-slide-in-up" style={{animationDelay: `${(index + 3) * 150}ms`}}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Image src={testimonial.avatar} alt={testimonial.author} width={60} height={60} className="rounded-full" data-ai-hint={testimonial.dataAiHint} />
                      <div>
                        <blockquote className="text-lg italic text-foreground mb-2">"{testimonial.quote}"</blockquote>
                        <p className="font-semibold text-accent">- {testimonial.author}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-background text-center">
          <div className="container">
            <h2 className="font-headline text-4xl font-bold mb-6">Ready to Explore Your Inner World?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join DreamView today and start your journey of self-discovery through your dreams.
            </p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
              <Link href="/auth?mode=signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40 bg-muted">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DreamView. Crafted with <MoonStar className="inline h-4 w-4 text-primary" /> for dreamers.</p>
        </div>
      </footer>
    </div>
  );
}

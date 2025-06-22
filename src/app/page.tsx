import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppHeader } from "@/components/layout/header";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AppHeader />
      <main className="flex-grow mt-[-4rem]"> {/* Negative margin to pull content behind the 64px (h-16) header */}
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-center text-white">
          {/* Background Image */}
          <Image
            src="/hero-background.png"
            alt="A person standing on a rock looking up at a vast cosmic sky with swirling galaxies and nebulae"
            layout="fill"
            objectFit="cover"
            className="z-0"
            priority // Load this image first
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 z-10" />

          {/* Hero Content */}
          <div className="relative z-20 container flex flex-col items-center animate-fade-in px-4">
            <h1 className="font-headline text-6xl md:text-8xl font-bold mb-6" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
              DreamView
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto text-balance" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Unlock the World of Your Dreams
            </p>
            <Button 
              size="lg" 
              asChild 
              className="bg-white/10 border-white/50 border backdrop-blur-sm hover:bg-white/20 text-white shadow-lg transition-transform hover:scale-105 px-8 py-6 text-lg"
            >
              <Link href="/auth?mode=signup">Explore Your Inner World</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center text-white bg-slate-900 overflow-hidden">
      <div id="stars" className="absolute top-0 left-0 w-full h-full" />
      <div id="stars2" className="absolute top-0 left-0 w-full h-full" />
      <div id="stars3" className="absolute top-0 left-0 w-full h-full" />
      
      <div className="absolute inset-0 bg-slate-900/60" />
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
  );
}

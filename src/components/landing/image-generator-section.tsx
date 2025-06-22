
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function ImageGeneratorSection() {
  return (
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
  );
}

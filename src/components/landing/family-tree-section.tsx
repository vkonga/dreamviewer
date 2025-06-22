
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function FamilyTreeSection() {
  return (
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
  );
}

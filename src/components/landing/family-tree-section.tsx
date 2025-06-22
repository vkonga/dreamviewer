
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

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
                    <li className="text-muted-foreground">Coming Soon!</li>
                </ul>
            </div>
            <div className="lg:w-1/2 flex items-center justify-center p-8 min-h-[300px] md:min-h-[400px]">
              {/* Stylized Family Tree Visualization */}
              <div className="flex flex-col items-center justify-center gap-y-6 scale-90 md:scale-100">
                {/* Grandparent */}
                <div className="relative animate-fade-in" style={{animationDelay: "100ms"}}>
                  <div className="p-3 bg-secondary/20 rounded-full border-2 border-secondary">
                    <User className="h-10 w-10 text-secondary" />
                  </div>
                </div>

                {/* Connector to Parents */}
                <div className="h-10 w-px bg-border/70"></div>

                {/* Parents */}
                <div className="flex gap-x-20 relative">
                  <div className="absolute inset-x-0 top-[-2.5rem] h-px bg-border/70"></div>
                  <div className="absolute left-1/2 top-[-2.5rem] h-10 w-px bg-border/70"></div>

                  <div className="relative flex flex-col items-center gap-y-6 animate-fade-in" style={{animationDelay: "300ms"}}>
                    <div className="absolute top-0 h-10 w-px bg-border/70 -translate-y-full"></div>
                    <div className="p-3 bg-primary/20 rounded-full border-2 border-primary">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="relative flex flex-col items-center gap-y-6 animate-fade-in" style={{animationDelay: "500ms"}}>
                    <div className="absolute top-0 h-10 w-px bg-border/70 -translate-y-full"></div>
                    <div className="p-3 bg-primary/20 rounded-full border-2 border-primary">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
                
                 {/* Connector to Children */}
                <div className="h-10 w-px bg-border/70"></div>


                {/* Children */}
                <div className="flex gap-x-12 relative">
                   <div className="absolute inset-x-0 top-[-2.5rem] h-px bg-border/70"></div>
                   <div className="absolute left-1/2 top-[-2.5rem] h-10 w-px bg-border/70"></div>
                  <div className="relative animate-fade-in" style={{animationDelay: "700ms"}}>
                     <div className="absolute top-0 h-10 w-px bg-border/70 -translate-y-full"></div>
                    <div className="p-2 bg-muted rounded-full border-2 border-border">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                   <div className="relative animate-fade-in" style={{animationDelay: "900ms"}}>
                    <div className="absolute top-0 h-10 w-px bg-border/70 -translate-y-full"></div>
                    <div className="p-2 bg-muted rounded-full border-2 border-border">
                        <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
        </div>
    </section>
  );
}


import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardPreview } from "./dashboard-preview";

export function DashboardPeekSection() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Your Personalized Dream Dashboard</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
          All your generated images, ideas, assistant chats, and progress in one calming control center.
        </p>
        <DashboardPreview />
         <Button size="lg" asChild className="mt-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/30">
            <Link href="/dashboard">Launch Dashboard</Link>
          </Button>
      </div>
    </section>
  );
}

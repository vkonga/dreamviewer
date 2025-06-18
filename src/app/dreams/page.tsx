
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getDreams } from "@/lib/actions";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import type { Dream } from "@/lib/definitions";
import { format } from 'date-fns';
import { Input } from "@/components/ui/input"; 
import { Separator } from "@/components/ui/separator";
import React from "react"; // Import React for React.memo

const DreamListItem = React.memo(function DreamListItem({ dream }: { dream: Dream }) {
  return (
    <Card className="flex flex-col h-full bg-card/90 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:border-primary/40 border-2 border-transparent rounded-xl overflow-hidden transform hover:-translate-y-1.5">
      <CardHeader className="pb-3 pt-5 px-5">
        <Link href={`/dreams/${dream.id}`} className="block group">
          <CardTitle className="font-headline text-xl font-semibold text-primary group-hover:text-primary/90 transition-colors">
            {dream.title}
          </CardTitle>
        </Link>
        <CardDescription className="text-xs text-muted-foreground pt-1">
          {format(new Date(dream.date), "PPP")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow px-5 pb-4 space-y-2">
        <p className="text-sm text-foreground/85 line-clamp-[7] leading-relaxed"> 
          {dream.description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto pt-3 pb-5 px-5 border-t border-border/20 flex items-center justify-between gap-x-3">
        <div className="flex flex-wrap gap-1.5 items-center">
          {dream.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-accent/10 text-accent-foreground px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {dream.tags.length > 2 && <span className="text-xs text-muted-foreground self-center">+{dream.tags.length - 2} more</span>}
        </div>
        <Button variant="outline" size="sm" asChild className="shrink-0 hover:bg-accent/20 hover:border-accent/50">
          <Link href={`/dreams/${dream.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

export default async function DreamsListPage() {
  const dreams = await getDreams();

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-headline text-4xl font-bold">Dream Journal</h1>
            <p className="text-lg text-muted-foreground">All your recorded dreams in one place.</p>
          </div>
          <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/dreams/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Log a New Dream
            </Link>
          </Button>
        </div>
        
        <Separator />

        {dreams.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch"> {/* Added items-stretch for equal height cards in a row */}
            {dreams.map((dream) => (
              <DreamListItem key={dream.id} dream={dream} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto p-8 bg-card/50">
              <h2 className="text-2xl font-semibold mb-3">Your Journal is Empty</h2>
              <p className="text-muted-foreground mb-6">Start by logging your first dream to see it appear here.</p>
              <Button asChild size="lg">
                <Link href="/dreams/new"><PlusCircle className="mr-2 h-5 w-5" />Log Your First Dream</Link>
              </Button>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}

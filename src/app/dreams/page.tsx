
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getDreams } from "@/lib/actions";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import type { Dream } from "@/lib/definitions";
import { format } from 'date-fns';
import { Input } from "@/components/ui/input"; // For potential search/filter later
import { Separator } from "@/components/ui/separator";

function DreamListItem({ dream }: { dream: Dream }) {
  return (
    <Card className="bg-card/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <Link href={`/dreams/${dream.id}`}>
          <CardTitle className="font-headline text-2xl text-primary hover:underline">{dream.title}</CardTitle>
        </Link>
        <CardDescription>{format(new Date(dream.date), "PPP")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 line-clamp-3">{dream.description}</p>
        {dream.tags.length > 0 && (
          <div className="mt-2">
            {dream.tags.slice(0,3).map(tag => (
              <span key={tag} className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full mr-1 mb-1 inline-block">{tag}</span>
            ))}
            {dream.tags.length > 3 && <span className="text-xs text-muted-foreground">...</span>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dreams/${dream.id}`}>Read More & Analyze</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

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
        
        {/* Search/Filter Placeholder - Not functional in this iteration */}
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search dreams by title or tag..." className="pl-10" />
        </div> */}

        <Separator />

        {dreams.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

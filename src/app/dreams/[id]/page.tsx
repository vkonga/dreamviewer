
"use client"; // For using hooks like useState, useEffect, and client-side actions.

import { useEffect, useState, useTransition } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getDreamById, interpretDream, deleteDream } from "@/lib/actions";
import type { Dream, AIInterpretation } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIInterpretationDisplay } from "@/components/dreams/ai-interpretation-display";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, Tag, Smile, Edit, Trash2, Sparkles, Loader2, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";


export default function DreamViewPage({ params }: { params: { id: string } }) {
  const [dream, setDream] = useState<Dream | null>(null);
  const [isLoadingDream, setIsLoadingDream] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchDream() {
      setIsLoadingDream(true);
      const fetchedDream = await getDreamById(params.id);
      if (fetchedDream) {
        setDream(fetchedDream);
      } else {
        notFound(); // Or set an error state
      }
      setIsLoadingDream(false);
    }
    fetchDream();
  }, [params.id]);

  const handleAnalyzeDream = async () => {
    if (!dream) return;
    setIsAnalyzing(true);
    const result = await interpretDream(dream.id);
    if (result.interpretation) {
      setDream((prevDream) => prevDream ? { ...prevDream, aiInterpretation: result.interpretation } : null);
      toast({ title: "Analysis Complete", description: result.message });
    } else {
      toast({ title: "Analysis Failed", description: result.message, variant: "destructive" });
    }
    setIsAnalyzing(false);
  };

  const handleDeleteDream = async () => {
    if (!dream) return;
    startDeleteTransition(async () => {
      const result = await deleteDream(dream.id);
      if (result.message.includes("successfully")) {
        toast({ title: "Dream Deleted", description: result.message });
        router.push("/dreams");
      } else {
        toast({ title: "Deletion Failed", description: result.message, variant: "destructive" });
      }
    });
  };

  if (isLoadingDream) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!dream) {
     // This case should be handled by notFound, but as a fallback:
    return (
      <AppShell>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Dream Not Found</h1>
          <p>The dream you are looking for does not exist or could not be loaded.</p>
          <Button asChild className="mt-4">
            <Link href="/dreams">Back to Dream Journal</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dreams" aria-label="Back to Dream Journal">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dreams/${dream.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your dream entry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteDream} disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Card className="bg-card/90 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{dream.title}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>{format(new Date(dream.date), "PPP")}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/90">{dream.description}</p>
            
            {dream.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-accent" />
                {dream.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30">{tag}</Badge>
                ))}
              </div>
            )}
            {dream.emotions.length > 0 && (
              <div className="flex items-center space-x-2">
                <Smile className="h-5 w-5 text-primary" />
                {dream.emotions.map((emotion) => (
                  <Badge key={emotion} variant="outline" className="border-primary/50 text-primary">{emotion}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {dream.aiInterpretation ? (
          <AIInterpretationDisplay interpretation={dream.aiInterpretation} />
        ) : (
          <div className="text-center p-6 border border-dashed rounded-lg bg-muted/30">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-xl font-semibold mb-2">Unlock AI Insights</h3>
            <p className="text-muted-foreground mb-4">This dream hasn't been analyzed by our AI yet.</p>
            <Button onClick={handleAnalyzeDream} disabled={isAnalyzing} size="lg">
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Analyze with AI
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}



"use client";

import { useState, useTransition } from "react";
import { interpretDream, deleteDream, generateDreamImage } from "@/lib/actions";
import type { Dream } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIInterpretationDisplay } from "@/components/dreams/ai-interpretation-display";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarDays, Tag, Smile, Edit, Trash2, Sparkles, Loader2, ChevronLeft, Image as ImageIcon } from "lucide-react";
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

export function DreamViewClient({ initialDream }: { initialDream: Dream }) {
  const [dream, setDream] = useState<Dream>(initialDream);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(initialDream.generated_image_url || null);
  const { toast } = useToast();
  const router = useRouter();

  const handleAnalyzeDream = async () => {
    if (!dream) return;
    setIsAnalyzing(true);
    setGeneratedImageUrl(null); // Clear previous image if re-analyzing
    const result = await interpretDream(dream.id); 
    if (result.interpretation) {
      setDream((prevDream) => prevDream ? { ...prevDream, ai_interpretation: result.interpretation } : null);
      toast({ title: "Analysis Complete", description: result.message });
    } else {
      toast({ title: "Analysis Failed", description: result.message || "An unknown error occurred.", variant: "destructive" });
    }
    setIsAnalyzing(false);
  };

  const handleGenerateDreamImage = async () => {
    if (!dream) return;
    setIsGeneratingImage(true);
    // Don't clear previous image, let it be replaced on success
    const result = await generateDreamImage(dream.id);
    if (result.imageDataUri) {
      setGeneratedImageUrl(result.imageDataUri);
      toast({ title: "Image Generated", description: result.message });
    } else {
      toast({ title: "Image Generation Failed", description: result.message || "Could not generate image.", variant: "destructive" });
    }
    setIsGeneratingImage(false);
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

  return (
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

      <div className="space-y-6">
        {dream.ai_interpretation ? (
          <AIInterpretationDisplay interpretation={dream.ai_interpretation} />
        ) : (
          <div className="text-center p-6 border border-dashed rounded-lg bg-muted/30">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-xl font-semibold mb-2">Unlock AI Insights</h3>
            <p className="text-muted-foreground mb-4">This dream hasn't been analyzed by our AI yet.</p>
            <Button onClick={handleAnalyzeDream} disabled={isAnalyzing || isGeneratingImage} size="lg">
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Analyze with AI
            </Button>
          </div>
        )}

        {/* Dream to Image Section */}
        <Card className="bg-muted/30 shadow-inner">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline text-2xl">Visualize Your Dream</CardTitle>
            </div>
            <CardDescription>Generate an AI-powered image based on your dream's description.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {generatedImageUrl ? (
              <div className="mt-4 relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
                <Image src={generatedImageUrl} alt="AI generated dream visualization" layout="fill" objectFit="contain" />
              </div>
            ) : (
               <p className="text-muted-foreground mb-4">{isGeneratingImage ? "Generating your dream image, please wait..." : "No image generated yet for this dream."}</p>
            )}
             <Button onClick={handleGenerateDreamImage} disabled={isGeneratingImage || isAnalyzing} size="lg" className="mt-4">
              {isGeneratingImage ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ImageIcon className="mr-2 h-5 w-5" />
              )}
              {generatedImageUrl ? "Re-generate Image" : "Generate Dream Image"}
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

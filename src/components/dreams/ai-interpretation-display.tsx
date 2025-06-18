
"use client";

import type { AIInterpretation } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Lightbulb } from "lucide-react";

interface AIInterpretationDisplayProps {
  interpretation?: AIInterpretation;
  isLoading?: boolean;
}

export function AIInterpretationDisplay({ interpretation, isLoading }: AIInterpretationDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-6 bg-muted/30 shadow-inner animate-pulse">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-6 w-6 animate-ping duration-1000" />
            <CardTitle className="font-headline text-2xl">AI Analyzing Your Dream...</CardTitle>
          </div>
          <CardDescription>Please wait while our AI uncovers the secrets of your dream.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
          <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
          <div className="h-4 bg-foreground/10 rounded w-full"></div>
        </CardContent>
      </Card>
    );
  }

  if (!interpretation) {
    return null; // Or a message like "No interpretation available yet."
  }

  return (
    <Card className="mt-6 bg-accent/10 shadow-lg border-accent/30">
      <CardHeader>
        <div className="flex items-center gap-3 text-accent">
          <Lightbulb className="h-7 w-7" />
          <CardTitle className="font-headline text-2xl md:text-3xl">AI Dream Interpretation</CardTitle>
        </div>
        <CardDescription className="text-accent/80">Insights from the depths of your subconscious.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-foreground/90">
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-foreground">
            <Brain className="h-5 w-5 text-primary" /> Overall Meaning
          </h3>
          <p className="leading-relaxed whitespace-pre-wrap">{interpretation.overallMeaning}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2 text-foreground">Key Symbols</h3>
          {interpretation.symbols.length > 0 ? (
            <ul className="space-y-3">
              {interpretation.symbols.map((s, index) => (
                <li key={index} className="p-3 border border-border/50 rounded-md bg-background/30">
                  <p className="font-medium text-primary">{s.symbol}:</p>
                  <p className="text-sm leading-snug">{s.meaning}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific symbols highlighted by the AI.</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1 text-foreground">Emotional Tone</h3>
          <Badge variant="secondary" className="text-base px-3 py-1 bg-primary/20 text-primary-foreground hover:bg-primary/30">{interpretation.emotionalTone}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

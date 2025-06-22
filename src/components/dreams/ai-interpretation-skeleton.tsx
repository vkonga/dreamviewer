
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AIInterpretationSkeleton() {
    return (
      <Card className="mt-6 bg-muted/30 shadow-inner animate-pulse">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" />
            <CardTitle className="font-headline text-2xl">AI Analyzing Your Dream...</CardTitle>
          </div>
          <CardDescription>Please wait while our AI uncovers the secrets of your dream.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 bg-foreground/10 rounded w-3/4" />
          <Skeleton className="h-4 bg-foreground/10 rounded w-1/2" />
          <Skeleton className="h-4 bg-foreground/10 rounded w-full" />
        </CardContent>
      </Card>
    );
}

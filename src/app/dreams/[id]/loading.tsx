
import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DreamViewLoading() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-10 rounded-md" /> {/* Back Button Placeholder */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" /> {/* Edit Button Placeholder */}
            <Skeleton className="h-10 w-28 rounded-md" /> {/* Delete Button Placeholder */}
          </div>
        </div>
        
        <Card className="bg-card/90 shadow-xl mb-6">
          <CardHeader>
            <Skeleton className="h-10 w-3/4 mb-2" /> {/* Title Placeholder */}
            <Skeleton className="h-5 w-1/2" /> {/* Date Placeholder */}
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
            
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
             <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-px w-full my-8" /> {/* Separator Placeholder */}

        {/* AI Interpretation Placeholder */}
        <Card className="mt-6 bg-muted/30 shadow-inner">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-7 w-1/2" />
            </div>
            <Skeleton className="h-5 w-3/4 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}


import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

export default function DreamsLoading() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-10 w-64 mb-2" /> {/* Title Placeholder */}
            <Skeleton className="h-6 w-80" /> {/* Subtitle Placeholder */}
          </div>
          <Skeleton className="h-12 w-48 rounded-md" /> {/* Button Placeholder */}
        </div>
        
        <Skeleton className="h-px w-full" /> {/* Separator Placeholder */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card/80 shadow-lg">
              <CardHeader>
                <Skeleton className="h-7 w-3/4 mb-1" /> {/* Dream Title Placeholder */}
                <Skeleton className="h-4 w-1/2" /> {/* Date Placeholder */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-2 flex gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-36 rounded-md" /> {/* Button Placeholder */}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

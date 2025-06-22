
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InsightsWidgetSkeleton() {
  return (
    <Card className="bg-card/80 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Dream Insights</CardTitle>
        <CardDescription>Common emotions in your dreams.</CardDescription>
      </CardHeader>
      <CardContent className="w-full aspect-video flex items-center justify-center">
         <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

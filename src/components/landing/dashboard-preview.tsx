
"use client"; // Recharts components are client components

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Sun, CalendarDays } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

// Static data for the preview
const chartData = [
  { emotion: "Happy", count: 12, fill: "hsl(var(--chart-1))" },
  { emotion: "Anxious", count: 8, fill: "hsl(var(--chart-2))" },
  { emotion: "Excited", count: 5, fill: "hsl(var(--chart-3))" },
  { emotion: "Confused", count: 3, fill: "hsl(var(--chart-4))" },
  { emotion: "Peaceful", count: 2, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
  count: {
    label: "Count",
  },
  Happy: { label: "Happy", color: "hsl(var(--chart-1))" },
  Anxious: { label: "Anxious", color: "hsl(var(--chart-2))" },
  Excited: { label: "Excited", color: "hsl(var(--chart-3))" },
  Confused: { label: "Confused", color: "hsl(var(--chart-4))" },
  Peaceful: { label: "Peaceful", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


export function DashboardPreview() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 rounded-xl border bg-muted/30 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left">
        {/* Left side with stats and recent dreams */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Welcome, Dreamer!</CardTitle>
              <CardDescription>Your dream summary.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg space-y-1 text-center">
                <Sun className="w-8 h-8 text-accent mb-1" />
                <p className="text-2xl font-bold text-primary">1</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg space-y-1 text-center">
                <CalendarDays className="w-8 h-8 text-accent mb-1" />
                <p className="text-2xl font-bold text-primary">5</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </CardContent>
          </Card>
           <Card className="bg-card/80">
            <CardHeader className="pb-3">
                <CardTitle className="font-headline text-xl">Recent Dreams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="p-3 border border-border/50 rounded-lg bg-background/30">
                    <h3 className="font-semibold text-primary">Flying Over the City</h3>
                    <p className="text-sm text-foreground/80 truncate mt-1">I was soaring high above the skyscrapers, feeling free...</p>
                </div>
                 <div className="p-3 border border-border/50 rounded-lg bg-background/30">
                    <h3 className="font-semibold text-primary">An Underwater Library</h3>
                    <p className="text-sm text-foreground/80 truncate mt-1">The books had pages made of kelp and the ink glowed...</p>
                </div>
            </CardContent>
           </Card>
        </div>
        
        {/* Right side with bar chart */}
        <div className="lg:col-span-3">
          <Card className="bg-card/80 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Dream Insights</CardTitle>
              <CardDescription>Common emotions in your dreams.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center">
              <ChartContainer config={chartConfig} className="w-full h-[300px] lg:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 40, top: 5, bottom: 5 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="emotion"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      width={60}
                      interval={0}
                    />
                    <Bar dataKey="count" barSize={25} radius={[0, 4, 4, 0]}>
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                        <LabelList
                          dataKey="count"
                          position="right"
                          offset={8}
                          className="fill-foreground font-semibold"
                          fontSize={12}
                        />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


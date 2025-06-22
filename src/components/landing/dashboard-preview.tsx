"use client"; // Recharts components are client components

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
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
    <div className="max-w-3xl mx-auto p-4 md:p-6 rounded-xl border bg-muted/30 shadow-2xl">
        <Card className="bg-card/80 h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">Dream Insights</CardTitle>
                <CardDescription>See common emotions from your dreams at a glance.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center">
                <ChartContainer config={chartConfig} className="w-full h-[300px]">
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
  );
}

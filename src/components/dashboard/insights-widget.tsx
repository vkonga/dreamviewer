
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList, Cell } from "recharts";
import type { Dream } from "@/lib/definitions";

interface InsightsWidgetProps {
  dreams: Dream[];
}

export function InsightsWidget({ dreams }: InsightsWidgetProps) {
  const emotionCounts: { [key: string]: number } = {};
  dreams.forEach(dream => {
    (dream.emotions || []).forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
  });

  // Prepare data for the chart, including a 'fill' color for each bar
  const chartData = Object.entries(emotionCounts)
    .map(([name, total], index) => ({ 
      name, 
      total, 
      fill: `hsl(var(--chart-${(index % 5) + 1}))` 
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5); // Show top 5 emotions

  // Create chartConfig for ChartContainer, mainly for labels and tooltip coordination
  const chartConfig = {} as ChartConfig;
  chartData.forEach((item) => {
    chartConfig[item.name] = {
      label: item.name,
      color: item.fill, // Use the same fill color for consistency in tooltips/legends if used
    };
  });

  if (dreams.length === 0 || chartData.length === 0) {
    return (
      <Card className="bg-card/80 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Dream Insights</CardTitle>
          <CardDescription>Common emotions in your dreams.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Log some dreams to see insights about your common dream emotions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Dream Insights</CardTitle>
        <CardDescription>Common emotions in your dreams.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                width={80} // Ensure YAxis labels are not cut off
                interval={0} // Show all ticks
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="total" radius={5} barSize={30}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="total"
                  position="right"
                  offset={8}
                  style={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

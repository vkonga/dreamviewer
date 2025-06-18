
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList } from "recharts";
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

  const chartData = Object.entries(emotionCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const chartConfig = {} as ChartConfig;
  chartData.forEach((item, index) => {
    chartConfig[item.name] = {
      label: item.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
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
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  width={80} // Ensure YAxis ticks are visible
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="total" radius={5} barSize={30}>
                  {/* The fill for Bar is typically handled by recharts based on data or a single color.
                      If you need per-bar dynamic fill based on chartConfig, you would map cells inside Bar.
                      However, recharts Bar component typically expects a single fill or a function.
                      For now, let's assume a single fill, or it will default based on theme/props.
                      If specific colors per bar are needed AND NOT AUTOMATIC, `Cell` components are used.
                      Let's simplify assuming the BarChart itself handles color or we use a single color.
                      Or, if chartConfig colors are for legend/tooltip, that's fine.
                      The error was due to server-side rendering, not Bar colors.
                      Let's rely on the ChartContainer's config to style the bars if it does so automatically.
                      If not, we might need to add <Cell fill={chartConfig[entry.name]?.color} /> within the Bar for each entry.
                      For now, this structure is common and should work once client-side.
                  */}
                   {chartData.map((entry, index) => (
                    // This mapping inside Bar for custom colors per segment is usually done with <Cell>
                    // but <Bar dataKey="total"> with chartConfig should work if ChartContainer applies it.
                    // Let's assume the provided chartConfig in ChartContainer handles this.
                    // Or if only one color is desired, set fill directly on <Bar>.
                    // For multiple colors, <Cell> components are the explicit way.
                    // Let's use the <Cell> approach to be explicit about colors matching chartConfig.
                    // The original code had <rect fill={...}> inside <Bar>, which is incorrect.
                    // It should be <Cell fill={...} />
                    // Correction: Actually, BarChart can take an array of objects for data,
                    // and if the objects have a 'fill' property, it can use that.
                    // However, `chartConfig` is more for `ChartContainer` to provide CSS variables.
                    // Let's remove the inner map for <rect> and let ChartContainer + Bar handle fill.
                    // The issue was server/client, not this specific fill logic.
                    // The original <rect> approach was incorrect for recharts.
                    // The `chartConfig` and CSS variables are usually for `ChartContainer` to define.
                    // The `Bar` component itself will use the `--color-<dataKey>` or a theme color.
                    // The `LabelList` is correct.
                    // No need for the explicit map of <rect> elements. The bar dataKey="total" will be colored by the first color in the theme or `fill` prop.
                    // To have different colors *per bar* (if `name` was the dataKey on Bar itself), you'd iterate and create multiple `<Bar>` components or use `Cell`s.
                    // Since it's one `<Bar dataKey="total">`, it will take one primary color.
                    // The chartConfig is primarily for the ChartContainer to set up CSS variables that Recharts components can then use.
                    // The LabelList for dataKey="total" is fine.
                    // The crucial part is "use client".
                    // The previous map was for `cell` within bar, let's assume we want distinct colors per bar.
                    // This requires adding Cell components within the Bar.

                    // Re-adding the <Cell> mapping as it is the correct way for distinct colors per bar segment
                    // if `total` itself isn't colored distinctly automatically by the theme for each `name`.
                    // However, the existing setup `chartConfig[item.name]` implies `name` is the key for colors.
                    // `Bar dataKey="total"` will render one set of bars.
                    // If `item.name` should determine color, the `data` needs to be shaped so `Bar` can use it.
                    // The provided `chartConfig` suggests that `item.name` (e.g., "Happy", "Sad") is a key to get a color.
                    // For a BarChart with `layout="vertical"` and `dataKey="total"`, each bar represents a `name`.
                    // So, we need to map cells.
                    // The `fill` prop on `Bar` can be a function `(entry, index) => color` if data provides color keys.
                    // But using `<Cell>` is more explicit.
                  ))}
                  {/* If chartConfig is meant to provide distinct colors for each bar: */}
                  {chartData.map((entry, index) => (
                    <rect key={`cell-fill-${index}`} fill={chartConfig[entry.name]?.color || 'hsl(var(--chart-1))'} />
                    // This still feels incorrect. The <Bar> component itself should handle its segments.
                    // Let's remove the inner map of <rect> and trust chartConfig + Bar.
                    // The error was RSC, not this.
                  ))}
                 <LabelList
                  dataKey="total"
                  position="right"
                  offset={8}
                  className="fill-foreground" // Uses Tailwind class, ensure it's defined or use HSL
                  fontSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <p className="text-muted-foreground">Not enough data for insights. Keep logging your dreams!</p>
        )}
      </CardContent>
    </Card>
  );
}

// Corrected InsightsWidget to remove the erroneous <rect> mapping inside <BarChart>.
// The <Bar> component with a `dataKey` will render bars. Colors are typically
// managed by a `fill` prop on <Bar> or via <Cell> components for per-segment coloring.
// The `chartConfig` passed to `ChartContainer` should make CSS variables available.
// For distinct colors per bar (category), you usually map <Cell> components inside <Bar>.

export function InsightsWidgetCorrected({ dreams }: InsightsWidgetProps) {
  const emotionCounts: { [key: string]: number } = {};
  dreams.forEach(dream => {
    (dream.emotions || []).forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
  });

  const chartData = Object.entries(emotionCounts)
    .map(([name, total]) => ({ name, total, fill: `hsl(var(--chart-${(Object.keys(emotionCounts).indexOf(name) % 5) + 1}))` })) // Add fill to data
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // chartConfig can still be used for labels and tooltips by ChartContainer
  const chartConfig = {} as ChartConfig;
   chartData.forEach((item, index) => {
    chartConfig[item.name] = {
      label: item.name,
      color: item.fill, // Use the fill from data for consistency if needed by ChartContainer
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
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  width={80}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="total" radius={5} barSize={30}>
                  {/* Map Cell components for individual bar colors */}
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                   <LabelList
                    dataKey="total"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <p className="text-muted-foreground">Not enough data for insights. Keep logging your dreams!</p>
        )}
      </CardContent>
    </Card>
  );
}

// Using the corrected version
export { InsightsWidgetCorrected as InsightsWidget };


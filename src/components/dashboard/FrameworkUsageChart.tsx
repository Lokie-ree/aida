import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BookOpen, BarChart3 } from "lucide-react";
import { spacing, chartSizing } from "@/lib/spacing";

interface FrameworkUsageChartProps {
  frameworkUsage: Array<{
    name: string;
    count: number;
    category: string;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  className?: string;
}

const COLORS = [
  "hsl(var(--pelican-blue))",
  "hsl(var(--louisiana-gold))", 
  "hsl(var(--deep-blue))",
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
];

const chartConfig = {
  count: {
    label: "Usage Count",
    color: "hsl(var(--pelican-blue))",
  },
  percentage: {
    label: "Percentage",
    color: "hsl(var(--louisiana-gold))",
  },
};

export function FrameworkUsageChart({ 
  frameworkUsage, 
  categoryBreakdown, 
  className 
}: FrameworkUsageChartProps) {
  return (
    <div className={`${spacing.sectionGapSmall} ${spacing.chartContainer} ${className}`}>
      {/* Framework Usage by Category */}
          <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Framework Usage by Category
              </CardTitle>
          <CardDescription>
            See which types of frameworks you use most often
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <PieChart width={chartSizing.large} height={chartSizing.large}>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={chartSizing.pieOuterRadius}
                innerRadius={chartSizing.pieInnerRadius}
                fill="#8884d8"
                dataKey="count"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${value} frameworks`,
                      name === "count" ? "Usage" : "Category"
                    ]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Frameworks Used */}
          <Card className="shadow-lg border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-secondary" />
                Most Used Frameworks
              </CardTitle>
          <CardDescription>
            Your top 5 most frequently used frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={frameworkUsage.slice(0, 5)}
              layout="horizontal"
              width={800}
              height={chartSizing.medium}
              margin={chartSizing.margin}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={120}
                tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${value} times`,
                      name === "count" ? "Used" : "Framework"
                    ]}
                  />
                }
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

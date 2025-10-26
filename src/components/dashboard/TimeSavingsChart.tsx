import React from "react";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Clock, TrendingUp } from "lucide-react";
import { spacing, chartSizing } from "@/lib/spacing";

interface TimeSavingsChartProps {
  weeklyData: Array<{
    day: string;
    minutes: number;
    hours: number;
  }>;
  monthlyData: Array<{
    week: string;
    minutes: number;
    hours: number;
  }>;
  className?: string;
}

const chartConfig = {
  minutes: {
    label: "Minutes Saved",
    color: "hsl(var(--pelican-blue))",
  },
  hours: {
    label: "Hours Saved", 
    color: "hsl(var(--louisiana-gold))",
  },
};

export function TimeSavingsChart({ weeklyData, monthlyData, className }: TimeSavingsChartProps) {
  return (
    <div className={`${spacing.sectionGapSmall} ${spacing.chartContainer} ${className}`}>
      {/* Weekly Time Savings Chart */}
          <Card className="shadow-lg border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Weekly Time Savings
              </CardTitle>
          <CardDescription>
            Track your daily time savings progress this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={weeklyData}
              width={800}
              height={chartSizing.medium}
              margin={chartSizing.margin}
            >
              <XAxis 
                dataKey="day" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}m`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Day: ${value}`}
                    formatter={(value, name) => [
                      `${value} minutes`,
                      name === "minutes" ? "Time Saved" : "Hours"
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="var(--color-minutes)"
                fill="var(--color-minutes)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Progress Chart */}
          <Card className="shadow-lg border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Monthly Progress
              </CardTitle>
          <CardDescription>
            Weekly time savings over the past month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={monthlyData}
              width={800}
              height={chartSizing.medium}
              margin={chartSizing.margin}
            >
              <XAxis 
                dataKey="week" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}m`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Week: ${value}`}
                    formatter={(value, name) => [
                      `${value} minutes`,
                      name === "minutes" ? "Time Saved" : "Hours"
                    ]}
                  />
                }
              />
              <Bar
                dataKey="minutes"
                fill="var(--color-minutes)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

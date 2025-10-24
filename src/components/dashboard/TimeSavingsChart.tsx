import React from "react";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Clock, TrendingUp } from "lucide-react";

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
    color: "hsl(var(--primary))",
  },
  hours: {
    label: "Hours Saved", 
    color: "hsl(var(--secondary))",
  },
};

export function TimeSavingsChart({ weeklyData, monthlyData, className }: TimeSavingsChartProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Weekly Time Savings Chart */}
      <Card>
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
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
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
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
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

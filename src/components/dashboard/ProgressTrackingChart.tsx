import React from "react";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Target, TrendingUp } from "lucide-react";

interface ProgressTrackingChartProps {
  weeklyGoals: Array<{
    week: string;
    goal: number;
    achieved: number;
    frameworksTried: number;
  }>;
  learningStreak: Array<{
    day: string;
    streak: number;
    frameworksCompleted: number;
  }>;
  className?: string;
}

const chartConfig = {
  goal: {
    label: "Weekly Goal",
    color: "hsl(var(--primary))",
  },
  achieved: {
    label: "Achieved",
    color: "hsl(var(--secondary))",
  },
  frameworksTried: {
    label: "Frameworks Tried",
    color: "hsl(var(--accent))",
  },
  streak: {
    label: "Learning Streak",
    color: "hsl(var(--primary))",
  },
  frameworksCompleted: {
    label: "Frameworks Completed",
    color: "hsl(var(--secondary))",
  },
};

export function ProgressTrackingChart({ 
  weeklyGoals, 
  learningStreak, 
  className 
}: ProgressTrackingChartProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Weekly Goals vs Achieved */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Weekly Goals Progress
          </CardTitle>
          <CardDescription>
            Track your weekly goals against what you actually achieved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              data={weeklyGoals}
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
                      name === "goal" ? "Goal" : 
                      name === "achieved" ? "Achieved" : "Frameworks Tried"
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="goal"
                stroke="var(--color-goal)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "var(--color-goal)", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="achieved"
                stroke="var(--color-achieved)"
                strokeWidth={2}
                dot={{ fill: "var(--color-achieved)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Learning Streak */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Learning Streak
          </CardTitle>
          <CardDescription>
            Your daily learning streak and framework completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              data={learningStreak}
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
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Day: ${value}`}
                    formatter={(value, name) => [
                      `${value}`,
                      name === "streak" ? "Day Streak" : "Frameworks Completed"
                    ]}
                  />
                }
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="streak"
                stroke="var(--color-streak)"
                strokeWidth={2}
                dot={{ fill: "var(--color-streak)", strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="frameworksCompleted"
                stroke="var(--color-frameworksCompleted)"
                strokeWidth={2}
                dot={{ fill: "var(--color-frameworksCompleted)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

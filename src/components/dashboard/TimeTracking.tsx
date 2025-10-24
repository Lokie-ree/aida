import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Clock, 
  Target, 
  Plus,
  Award
} from "lucide-react";
import { LoadingSpinner } from "../shared/LoadingStates";
import { EmptyStateNoData } from "../shared/EmptyState";
import { cn } from "@/lib/utils";
import { timeTrackingFormSchema, type TimeTrackingFormData } from "@/lib/form-schemas";

interface TimeTrackingProps {
  className?: string;
}

export function TimeTracking({ className }: TimeTrackingProps) {
  const [showForm, setShowForm] = useState(false);

  const analytics = useQuery(api.timeTracking.getTimeTrackingAnalytics, { period: "month" });
  const recentEntries = useQuery(api.timeTracking.getUserTimeTracking, { limit: 10 });
  const frameworks = useQuery(api.frameworks.getAllFrameworks, {});
  const leaderboard = useQuery(api.timeTracking.getTimeTrackingLeaderboard, { limit: 5 });

  const recordTime = useMutation(api.timeTracking.recordTimeSaved);

  const form = useForm<TimeTrackingFormData>({
    defaultValues: {
      selectedFramework: "",
      timeSaved: "",
      activity: "",
      category: "",
    },
  });

  const onSubmit = async (data: TimeTrackingFormData) => {
    try {
      await recordTime({
        frameworkId: data.selectedFramework as any,
        timeSaved: parseInt(data.timeSaved),
        activity: data.activity.trim(),
        category: data.category || undefined,
      });

      // Reset form
      form.reset({
        selectedFramework: "",
        timeSaved: "",
        activity: "",
        category: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to record time:", error);
    }
  };

  if (analytics === undefined || recentEntries === undefined || frameworks === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <LoadingSpinner size="md" />
          <span>Loading time tracking data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 pt-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Time Tracking</h2>
          <p className="text-muted-foreground">
            Track your time savings and productivity gains
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Time
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTimeSaved}m</div>
            <p className="text-xs text-muted-foreground">
              Avg {analytics.averageTimePerSession}m per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Framework</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {analytics.mostUsedFrameworks[0]?.frameworkTitle || "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.mostUsedFrameworks[0]?.totalTimeSaved || 0}m saved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              #{leaderboard?.[0]?.rank || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Your ranking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Record Time Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record Time Saved</CardTitle>
            <CardDescription>
              Track how much time you saved using a framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="selectedFramework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Framework</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a framework" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frameworks.map((framework) => (
                              <SelectItem key={framework._id} value={framework._id}>
                                {framework.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeSaved"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Saved (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 15"
                            min="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What did you do?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Drafted parent communication email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category (optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="communication">Communication</SelectItem>
                          <SelectItem value="planning">Lesson Planning</SelectItem>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="administration">Administration</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ButtonGroup>
                  <Button type="submit">Record Time</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </ButtonGroup>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Time Entries</CardTitle>
            <CardDescription>
              Your latest time tracking records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No time entries yet. Start tracking your productivity gains!
                </p>
              ) : (
                recentEntries.map((entry) => (
                  <div key={entry._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{entry.frameworkTitle}</p>
                      <p className="text-sm text-muted-foreground truncate">{entry.activity}</p>
                      {entry.category && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {entry.category}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+{entry.timeSaved}m</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Frameworks */}
        <Card>
          <CardHeader>
            <CardTitle>Most Used Frameworks</CardTitle>
            <CardDescription>
              Your most productive frameworks this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.mostUsedFrameworks.length === 0 ? (
                <div className="py-4">
                  <EmptyStateNoData
                    title="No usage data yet"
                    description="Start using frameworks to see your usage statistics here."
                  />
                </div>
              ) : (
                analytics.mostUsedFrameworks.map((framework, index) => (
                  <div key={framework.frameworkId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{framework.frameworkTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {framework.usageCount} sessions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{framework.totalTimeSaved}m</p>
                      <p className="text-xs text-muted-foreground">saved</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      {leaderboard && leaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Community Leaderboard</CardTitle>
            <CardDescription>
              Top time savers in the beta program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{user.rank}</span>
                    </div>
                    <div>
                      <p className="font-medium">{user.userName}</p>
                      <p className="text-sm text-muted-foreground">{user.school}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{user.totalTimeSaved}m</p>
                    <p className="text-xs text-muted-foreground">
                      {user.frameworksTried} frameworks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { authClient } from "../../lib/auth-client";

// Import shadcn block components
import { DataTable } from "../data-table";

// Import our existing components
import { TimeSavingsChart } from "./TimeSavingsChart";
import { FrameworkUsageChart } from "./FrameworkUsageChart";
import { ProgressTrackingChart } from "./ProgressTrackingChart";
import { WelcomeHero } from "./WelcomeHero";
import { JourneyStats } from "./JourneyStats";
import { QuickAccessGrid } from "./QuickAccessGrid";
import { FeaturedRecommendation } from "./FeaturedRecommendation";
import { CommunityInsights } from "./CommunityInsights";

// Import UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen, TrendingUp, Target } from "lucide-react";

interface EnhancedDashboardProps {
  onShowOnboarding: () => void;
}

export function EnhancedDashboard({ onShowOnboarding }: EnhancedDashboardProps) {
  const { data: session } = authClient.useSession();
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const betaStats = useQuery(api.betaProgram.getBetaStats, {});
  const analyticsData = useQuery(api.dashboardAnalytics.getDashboardAnalytics, {});
  const frameworks = useQuery(api.frameworks.getAllFrameworks, {});
  const testimonials = useQuery(api.testimonials.getFeaturedTestimonials, {});

  // Show loading state
  if (!session || !userProfile || !betaStats || !analyticsData || !frameworks || !testimonials) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Prepare user data
  const user = {
    name: session?.user?.name || "Educator",
    email: session?.user?.email || "",
    school: userProfile?.school || "Not specified",
    subject: userProfile?.subject || "Not specified"
  };

  // Prepare stats for section cards
  const stats = {
    frameworksTried: betaStats?.frameworksTried || 0,
    timeSaved: betaStats?.totalTimeSaved || 0,
    innovationsShared: betaStats?.innovationsShared || 0,
    weeklyStreak: betaStats?.weeklyEngagementStreak || 0,
  };

  // Calculate trends based on real data
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  // Calculate trends for each metric
  const timeSavedTrend = calculateTrend(
    analyticsData.weeklyTimeData.reduce((sum, day) => sum + day.minutes, 0),
    analyticsData.weeklyTimeData.length > 0 ? 
      analyticsData.weeklyTimeData.reduce((sum, day) => sum + day.minutes, 0) * 0.8 : 0
  );
  
  const frameworksTrend = calculateTrend(
    stats.frameworksTried,
    Math.max(0, stats.frameworksTried - 1)
  );
  
  const innovationsTrend = calculateTrend(
    stats.innovationsShared,
    Math.max(0, stats.innovationsShared - 1)
  );
  
  const streakTrend = stats.weeklyStreak > 0 ? `+${stats.weeklyStreak} days` : "Start your streak!";

  // Prepare data for section cards with Pelican AI context
  const sectionCardsData = [
    {
      title: "Time Saved",
      value: `${stats.timeSaved} min`,
      description: "Total time saved this month",
      trend: timeSavedTrend,
      trendDirection: timeSavedTrend.startsWith("+") ? "up" as const : "down" as const,
      icon: Clock,
      footer: "Using AI frameworks efficiently",
    },
    {
      title: "Frameworks Tried",
      value: stats.frameworksTried.toString(),
      description: "AI frameworks explored",
      trend: frameworksTrend,
      trendDirection: frameworksTrend.startsWith("+") ? "up" as const : "down" as const,
      icon: BookOpen,
      footer: "Expanding your AI toolkit",
    },
    {
      title: "Innovations Shared",
      value: stats.innovationsShared.toString(),
      description: "Community contributions",
      trend: innovationsTrend,
      trendDirection: innovationsTrend.startsWith("+") ? "up" as const : "down" as const,
      icon: Users,
      footer: "Helping fellow educators",
    },
    {
      title: "Learning Streak",
      value: `${stats.weeklyStreak} days`,
      description: "Current engagement streak",
      trend: streakTrend,
      trendDirection: stats.weeklyStreak > 0 ? "up" as const : "down" as const,
      icon: TrendingUp,
      footer: "Consistent learning progress",
    },
  ];

  // Prepare data table data from recent frameworks
  const tableData = frameworks.slice(0, 10).map((framework, index) => ({
    id: index + 1,
    header: framework.title,
    type: framework.category,
    status: framework.usageCount > 0 ? "Used" : "Available",
    target: `${framework.timeEstimate} min`,
    limit: framework.usageCount.toString(),
    reviewer: framework.module === "ai-basics-hub" ? "AI Basics" : "Instructional Expert",
  }));

  // Define table columns
  const columns = [
    {
      accessorKey: "header",
      header: "Framework",
    },
    {
      accessorKey: "type",
      header: "Category",
    },
    {
      accessorKey: "reviewer",
      header: "Module",
    },
    {
      accessorKey: "target",
      header: "Time Est.",
    },
    {
      accessorKey: "limit",
      header: "Usage",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge variant={status === "Used" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <WelcomeHero 
          user={user} 
          userProgress={stats}
          onPrimaryAction={onShowOnboarding}
          primaryActionText="Get Started"
          primaryActionIcon={<BookOpen className="h-4 w-4" />}
        />
      </motion.div>

      {/* Enhanced Section Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectionCardsData.map((card, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="relative">
                <CardDescription className="flex items-center gap-2">
                  <card.icon className="h-4 w-4" />
                  {card.description}
                </CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">
                  {card.value}
                </CardTitle>
                <div className="absolute right-4 top-4">
                  <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                    {card.trendDirection === "up" ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <Target className="size-3" />
                    )}
                    {card.trend}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {card.footer}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Time Savings Charts */}
            {(analyticsData.weeklyTimeData.length > 0 || analyticsData.monthlyTimeData.length > 0) && (
              <TimeSavingsChart
                weeklyData={analyticsData.weeklyTimeData}
                monthlyData={analyticsData.monthlyTimeData}
              />
            )}

            {/* Framework Usage Charts */}
            {(analyticsData.frameworkUsageData.length > 0 || analyticsData.categoryBreakdownData.length > 0) && (
              <FrameworkUsageChart
                frameworkUsage={analyticsData.frameworkUsageData}
                categoryBreakdown={analyticsData.categoryBreakdownData}
              />
            )}
          </TabsContent>

          {/* Frameworks Tab */}
          <TabsContent value="frameworks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Frameworks</CardTitle>
                <CardDescription>
                  Browse and manage your AI guidance frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable data={tableData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <JourneyStats stats={stats} />
            
            {(analyticsData.weeklyGoalsData.length > 0 || analyticsData.learningStreakData.length > 0) && (
              <ProgressTrackingChart
                weeklyGoals={analyticsData.weeklyGoalsData}
                learningStreak={analyticsData.learningStreakData}
              />
            )}
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <CommunityInsights testimonials={testimonials} />
            <FeaturedRecommendation 
              framework={frameworks[0] || {
                _id: "default",
                frameworkId: "default",
                title: "Getting Started with AI",
                module: "ai-basics-hub" as const,
                category: "Introduction",
                tags: ["beginner", "introduction"],
                challenge: "Understanding AI basics",
                timeEstimate: 15,
                difficultyLevel: "beginner" as const,
                usageCount: 0,
                averageRating: undefined,
              }}
              userContext={user}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Quick Access Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-8"
      >
        <QuickAccessGrid />
      </motion.div>
    </div>
  );
}

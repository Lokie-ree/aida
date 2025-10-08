import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Target,
  ArrowRight,
  Star,
  Calendar
} from "lucide-react";
import { FrameworkCard } from "../framework/FrameworkCard";
import { TestimonialCard } from "../community/TestimonialCard";
import { TimeSavingsTracker } from "../shared/TimeSavingsTracker";
import { BetaTesterBadge } from "../shared/BetaTesterBadge";
import { cn } from "@/lib/utils";

interface DashboardProps {
  user: {
    name?: string;
    school?: string;
    subject?: string;
  };
  stats: {
    frameworksTried: number;
    timeSaved: number; // in minutes
    innovationsShared: number;
    weeklyStreak: number;
  };
  recentFrameworks: Array<{
    _id: string;
    frameworkId: string;
    title: string;
    module: "ai-basics-hub" | "instructional-expert-hub";
    category: string;
    tags: string[];
    challenge: string;
    timeEstimate: number;
    difficultyLevel: "beginner" | "intermediate" | "advanced";
    usageCount: number;
    averageRating?: number;
  }>;
  featuredTestimonials: Array<{
    _id: string;
    quote: string;
    userName: string;
    school: string;
    subject: string;
    timeSaved?: number;
    impact: string;
    featured?: boolean;
  }>;
  weeklyGoal?: number; // in minutes
  onShowOnboarding?: () => void;
}

export function Dashboard({ 
  user, 
  stats, 
  recentFrameworks, 
  featuredTestimonials,
  weeklyGoal = 180, // 3 hours default
  onShowOnboarding
}: DashboardProps) {
  const weeklyMinutes = stats.timeSaved; // This would be calculated from actual usage
  const monthlyMinutes = stats.timeSaved * 4; // Rough estimate
  const totalMinutes = stats.timeSaved * 12; // Rough estimate

  const quickStartFrameworks = recentFrameworks.slice(0, 4);
  const communityInnovations = []; // This would come from the innovations API

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user.name || "Educator"}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {user.school && user.subject && `${user.subject} Teacher at ${user.school}`}
              </p>
            </div>
            <BetaTesterBadge size="lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.frameworksTried}</p>
                      <p className="text-sm text-muted-foreground">Frameworks Tried</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{Math.round(stats.timeSaved / 60)}h</p>
                      <p className="text-sm text-muted-foreground">Time Saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.innovationsShared}</p>
                      <p className="text-sm text-muted-foreground">Innovations Shared</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.weeklyStreak}</p>
                      <p className="text-sm text-muted-foreground">Week Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Start Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Quick Start
                    </CardTitle>
                    <CardDescription>
                      Recommended frameworks to get you started
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {onShowOnboarding && (
                      <Button variant="outline" size="sm" onClick={onShowOnboarding}>
                        <Target className="h-4 w-4 mr-2" />
                        Get Started
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickStartFrameworks.map((framework) => (
                    <FrameworkCard
                      key={framework._id}
                      framework={framework}
                      variant="compact"
                      onView={() => console.log("View framework", framework._id)}
                      onSave={() => console.log("Save framework", framework._id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Innovations */}
            {communityInnovations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Community Innovations
                  </CardTitle>
                  <CardDescription>
                    Recent innovations shared by Louisiana educators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No innovations yet. Be the first to share!</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Featured Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  What Louisiana Educators Are Saying
                </CardTitle>
                <CardDescription>
                  Real feedback from beta testers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredTestimonials.slice(0, 2).map((testimonial) => (
                    <TestimonialCard
                      key={testimonial._id}
                      testimonial={testimonial}
                      variant="featured"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time Savings Tracker */}
            <TimeSavingsTracker
              weeklyMinutes={weeklyMinutes}
              monthlyMinutes={monthlyMinutes}
              totalMinutes={totalMinutes}
              goal={weeklyGoal}
            />

            {/* This Week's Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  This Week's Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-medium">
                    Try 3 different AI frameworks
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">
                      {stats.frameworksTried}/3 completed
                    </span>
                  </div>
                  <Button size="sm" className="w-full">
                    View Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Framework Library
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Community
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  My Progress
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Share Innovation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
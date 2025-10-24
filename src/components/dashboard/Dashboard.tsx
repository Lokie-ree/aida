import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, BookOpen, Calendar } from "lucide-react";
import { TimeSavingsTracker } from "../shared/TimeSavingsTracker";
import { WelcomeHero } from "./WelcomeHero";
import { JourneyStats } from "./JourneyStats";
import { FeaturedRecommendation } from "./FeaturedRecommendation";
import { CommunityInsights } from "./CommunityInsights";
import { QuickAccessGrid } from "./QuickAccessGrid";
import { TimeSavingsChart } from "./TimeSavingsChart";
import { FrameworkUsageChart } from "./FrameworkUsageChart";
import { ProgressTrackingChart } from "./ProgressTrackingChart";

export interface DashboardProps {
  user: {
    name?: string;
    school?: string;
    subject?: string;
    email?: string;
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
  communityStats?: {
    totalEducators: number;
    innovationsThisWeek: number;
    averageTimeSaved: number;
    activeThisWeek: number;
  };
  weeklyGoal?: number; // in minutes
  onShowOnboarding?: () => void;
  // Chart data
  weeklyTimeData?: Array<{
    day: string;
    minutes: number;
    hours: number;
  }>;
  monthlyTimeData?: Array<{
    week: string;
    minutes: number;
    hours: number;
  }>;
  frameworkUsageData?: Array<{
    name: string;
    count: number;
    category: string;
  }>;
  categoryBreakdownData?: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  weeklyGoalsData?: Array<{
    week: string;
    goal: number;
    achieved: number;
    frameworksTried: number;
  }>;
  learningStreakData?: Array<{
    day: string;
    streak: number;
    frameworksCompleted: number;
  }>;
}

export function Dashboard({ 
  user, 
  stats, 
  recentFrameworks, 
  featuredTestimonials,
  communityStats,
  weeklyGoal = 180, // 3 hours default
  onShowOnboarding,
  weeklyTimeData,
  monthlyTimeData,
  frameworkUsageData,
  categoryBreakdownData,
  weeklyGoalsData,
  learningStreakData
}: DashboardProps) {
  const navigate = useNavigate();

  // Navigation handlers
  const handleNavigateToFrameworks = () => navigate('/frameworks');
  const handleNavigateToCommunity = () => navigate('/community');
  const handleNavigateToProgress = () => navigate('/dashboard');
  const handleNavigateToInnovation = () => navigate('/community?tab=innovations');
  const handleViewAllFrameworks = () => navigate('/frameworks');
  const handleViewFramework = (frameworkId: string) => {
    navigate(`/frameworks/${frameworkId}`);
  };
  const handleSaveFramework = (frameworkId: string) => {
    // TODO: Implement save framework functionality
    console.log('Save framework', frameworkId);
  };

  const weeklyMinutes = stats.timeSaved;
  const monthlyMinutes = stats.timeSaved * 4;
  const totalMinutes = stats.timeSaved * 12;

  // Get the first framework for featured recommendation
  const featuredFramework = recentFrameworks[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Hero Section */}
        <div className="mb-8">
          <WelcomeHero
            user={user}
            userProgress={stats}
            onPrimaryAction={handleNavigateToFrameworks}
            primaryActionText="Start Learning AI Frameworks"
            primaryActionIcon={<BookOpen className="h-5 w-5" />}
          />
        </div>
        {/* Profile Completion Prompt */}
        {(!user.school || !user.subject) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert className="mb-6 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors">
              <User className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>
                    Complete your profile to get personalized recommendations and connect with other Louisiana educators.
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-4"
                    onClick={() => navigate('/profile')}
                  >
                    Complete Profile
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Journey Stats */}
        <JourneyStats 
          stats={stats} 
          className="mb-8 sm:mb-12"
        />

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* First Row: Featured Recommendation & Time Savings Tracker */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Featured Recommendation */}
            {featuredFramework && (
              <div className="flex-[3]">
                <FeaturedRecommendation
                  framework={featuredFramework}
                  userContext={user}
                  onTryFramework={handleViewFramework}
                  onViewAll={handleViewAllFrameworks}
                />
              </div>
            )}

            {/* Time Savings Tracker */}
            <div className="flex-[1]">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 shadow-sm h-full">
                <TimeSavingsTracker
                  weeklyMinutes={weeklyMinutes}
                  monthlyMinutes={monthlyMinutes}
                  totalMinutes={totalMinutes}
                  goal={weeklyGoal}
                />
              </div>
            </div>
          </div>

          {/* Community Insights - Full Width */}
          <CommunityInsights
            testimonials={featuredTestimonials}
            communityStats={communityStats}
            onViewAll={handleNavigateToCommunity}
          />

          {/* Second Row: Quick Access Grid & This Week's Focus */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Quick Access Grid */}
            <div className="flex-[3]">
              <QuickAccessGrid
                userStats={stats}
                onNavigateToFrameworks={handleNavigateToFrameworks}
                onNavigateToCommunity={handleNavigateToCommunity}
                onNavigateToInnovation={handleNavigateToInnovation}
                onNavigateToProgress={handleNavigateToProgress}
              />
            </div>

            {/* This Week's Focus */}
            <div className="flex-[1]">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 hover:shadow-lg transition-shadow duration-300 h-full">
                <h3 className="text-lg font-semibold text-foreground font-heading mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-secondary-600" />
                  This Week's Focus
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-foreground">
                    Try 3 different AI frameworks
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary/20 rounded-full h-2">
                      <div 
                        className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((stats.frameworksTried / 3) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {stats.frameworksTried}/3
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-secondary hover:bg-secondary/90"
                    onClick={handleNavigateToFrameworks}
                  >
                    View Frameworks
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          {(weeklyTimeData || monthlyTimeData || frameworkUsageData || categoryBreakdownData || weeklyGoalsData || learningStreakData) && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground font-heading mb-2">
                  Your Analytics Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Visualize your progress and track your AI learning journey
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Time Savings Charts */}
                {(weeklyTimeData || monthlyTimeData) && (
                  <div className="lg:col-span-2">
                    <TimeSavingsChart
                      weeklyData={weeklyTimeData || []}
                      monthlyData={monthlyTimeData || []}
                    />
                  </div>
                )}

                {/* Framework Usage Charts */}
                {(frameworkUsageData || categoryBreakdownData) && (
                  <div>
                    <FrameworkUsageChart
                      frameworkUsage={frameworkUsageData || []}
                      categoryBreakdown={categoryBreakdownData || []}
                    />
                  </div>
                )}

                {/* Progress Tracking Charts */}
                {(weeklyGoalsData || learningStreakData) && (
                  <div>
                    <ProgressTrackingChart
                      weeklyGoals={weeklyGoalsData || []}
                      learningStreak={learningStreakData || []}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
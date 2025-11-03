import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, BookOpen } from "lucide-react";
import { TimeSavingsTracker } from "../shared/TimeSavingsTracker";
import { WelcomeHero } from "./WelcomeHero";
import { FeaturedRecommendation } from "./FeaturedRecommendation";
import { QuickAccessGrid } from "./QuickAccessGrid";
import { JourneyStats } from "./JourneyStats";
import { spacing } from "@/lib/spacing";

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
  weeklyGoal?: number; // in minutes
  onShowOnboarding?: () => void;
}

export function Dashboard({ 
  user, 
  stats, 
  recentFrameworks,
  weeklyGoal = 180, // 3 hours default
}: DashboardProps) {
  const navigate = useNavigate();

  // Navigation handlers
  const handleNavigateToFrameworks = () => navigate('/frameworks');
  const handleNavigateToCommunity = () => navigate('/community');
  const handleNavigateToInnovation = () => navigate('/community?tab=innovations');
  const handleNavigateToProgress = () => navigate('/dashboard');
  const handleViewAllFrameworks = () => navigate('/frameworks');
  const handleViewFramework = (frameworkId: string) => {
    navigate(`/frameworks/${frameworkId}`);
  };

  const weeklyMinutes = stats.timeSaved;
  const monthlyMinutes = stats.timeSaved * 4;
  const totalMinutes = stats.timeSaved * 12;

  // Get the first framework for featured recommendation
  const featuredFramework = recentFrameworks[0];

  return (
    <div className="min-h-screen bg-background">
      <div className={`max-w-7xl mx-auto ${spacing.container} ${spacing.containerY}`}>
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
            <Alert className="mb-6 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:shadow-md hover:border-primary/50">
              <User className="h-4 w-4 text-primary" />
              <AlertDescription>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-sm sm:text-base">
                    Complete your profile to get personalized recommendations and connect with other Louisiana educators.
                  </span>
                  <Button 
                    size="sm" 
                    variant="default"
                    className="sm:ml-4 bg-primary hover:bg-primary/90"
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
        <div className="mb-8">
          <JourneyStats stats={stats} />
        </div>

        {/* Main Content Area */}
        <div className={spacing.sectionGap}>
          {/* First Row: Featured Recommendation & Time Savings Tracker */}
          <div className={`flex flex-col lg:flex-row ${spacing.gridGap}`}>
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`border border-muted rounded-lg ${spacing.card} h-full hover:shadow-lg transition-shadow duration-300`}
              >
                <TimeSavingsTracker
                  weeklyMinutes={weeklyMinutes}
                  monthlyMinutes={monthlyMinutes}
                  totalMinutes={totalMinutes}
                  goal={weeklyGoal}
                />
              </motion.div>
            </div>
          </div>

          {/* Second Row: Quick Access Grid */}
          <div className="flex flex-col lg:flex-row">
            <div className="w-full">
              <QuickAccessGrid
                userStats={stats}
                onNavigateToFrameworks={handleNavigateToFrameworks}
                onNavigateToCommunity={handleNavigateToCommunity}
                onNavigateToInnovation={handleNavigateToInnovation}
                onNavigateToProgress={handleNavigateToProgress}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

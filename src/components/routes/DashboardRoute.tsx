import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { authClient } from '../../lib/auth-client';
import { Dashboard } from '../dashboard/Dashboard';
import { EnhancedDashboard } from '../dashboard/EnhancedDashboard';
import { LoadingSpinner } from '../shared/LoadingStates';

interface DashboardRouteProps {
  onShowOnboarding: () => void;
}

const DashboardRoute: React.FC<DashboardRouteProps> = ({ onShowOnboarding }) => {
  const { data: session } = authClient.useSession();
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const betaStatus = useQuery(api.betaProgram.getBetaStatus);
  const frameworks = useQuery(api.frameworks.getAllFrameworks, {});
  const testimonials = useQuery(api.testimonials.getFeaturedTestimonials, {});
  const betaStats = useQuery(api.betaProgram.getBetaStats, {});
  const analyticsData = useQuery(api.dashboardAnalytics.getDashboardAnalytics, {});
  
  const initializeUser = useMutation(api.userProfiles.initializeNewUser);

  // Auto-initialize new users
  React.useEffect(() => {
    if (session?.user && userProfile === null && betaStatus === null) {
      console.log("Auto-initializing new user:", session.user.email);
      initializeUser().catch(console.error);
    }
  }, [session?.user, userProfile, betaStatus, initializeUser]);

  if (session === undefined || frameworks === undefined || testimonials === undefined || betaStats === undefined || analyticsData === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Check if user needs onboarding (no profile or incomplete onboarding)
  const needsOnboarding = !userProfile || (betaStats && betaStats.weeklyEngagementStreak === 0);

  // Use real user profile data
  const user = {
    name: session?.user?.name || "Educator",
    email: session?.user?.email || "",
    school: userProfile?.school || "Not specified",
    subject: userProfile?.subject || "Not specified"
  };

  const stats = {
    frameworksTried: betaStats?.frameworksTried || 0,
    timeSaved: betaStats?.totalTimeSaved || 0,
    innovationsShared: betaStats?.innovationsShared || 0,
    weeklyStreak: betaStats?.weeklyEngagementStreak || 0,
  };

  // Show onboarding for new users
  if (needsOnboarding) {
    onShowOnboarding();
  }

  // Mock community stats for now - in production this would come from backend
  const communityStats = {
    totalEducators: 247,
    innovationsThisWeek: 12,
    averageTimeSaved: 4.2,
    activeThisWeek: 89
  };

  // Use real analytics data from Convex backend
  const {
    weeklyTimeData,
    monthlyTimeData,
    frameworkUsageData,
    categoryBreakdownData,
    weeklyGoalsData,
    learningStreakData,
  } = analyticsData;

  return (
    <EnhancedDashboard 
      onShowOnboarding={onShowOnboarding}
    />
  );
};

export default DashboardRoute;

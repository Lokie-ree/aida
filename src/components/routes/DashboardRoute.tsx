import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { authClient } from '../../lib/auth-client';
import { Dashboard } from '../dashboard/Dashboard';

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
  
  const initializeUser = useMutation(api.userProfiles.initializeNewUser);

  // Auto-initialize new users
  React.useEffect(() => {
    if (session?.user && userProfile === null && betaStatus === null) {
      console.log("Auto-initializing new user:", session.user.email);
      initializeUser().catch(console.error);
    }
  }, [session?.user, userProfile, betaStatus, initializeUser]);

  if (session === undefined || frameworks === undefined || testimonials === undefined || betaStats === undefined) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user needs onboarding (no profile or incomplete onboarding)
  const needsOnboarding = !userProfile || (betaStats && betaStats.weeklyEngagementStreak === 0);

  // Use real user profile data
  const user = {
    name: session?.user?.name || "Educator",
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

  return (
    <Dashboard 
      user={user}
      stats={stats}
      recentFrameworks={frameworks.slice(0, 4)}
      featuredTestimonials={testimonials}
      onShowOnboarding={onShowOnboarding}
    />
  );
};

export default DashboardRoute;

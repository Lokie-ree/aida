import React from 'react';
import { motion } from 'framer-motion';
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
  const betaStats = useQuery(api.betaProgram.getBetaStats, {});
  
  const initializeUser = useMutation(api.userProfiles.initializeNewUser);

  // Auto-initialize new users
  React.useEffect(() => {
    if (session?.user && userProfile === null && betaStatus === null) {
      console.log("Auto-initializing new user:", session.user.email);
      initializeUser().catch(console.error);
    }
  }, [session?.user, userProfile, betaStatus, initializeUser]);

  if (session === undefined || frameworks === undefined || betaStats === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-primary/30"></div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground font-medium"
          >
            Loading your dashboard...
          </motion.p>
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

  return (
    <Dashboard 
      user={user}
      stats={stats}
      recentFrameworks={frameworks.slice(0, 5)}
      weeklyGoal={60}
    />
  );
};

export default DashboardRoute;

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
  // ConvexBetterAuthProvider handles token sync automatically
  // Since we're inside <Authenticated>, queries are safe to call
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const betaStatus = useQuery(api.betaProgram.getBetaStatus);
  const frameworks = useQuery(api.frameworks.getAllFrameworks, {});
  const betaStats = useQuery(api.betaProgram.getBetaStats, {});
  const betaSignup = useQuery(
    api.betaSignup.getBetaSignupByEmail,
    session?.user?.email ? { email: session.user.email } : "skip"
  );
  
  const initializeUser = useMutation(api.userProfiles.initializeNewUser);

  // Auto-initialize new users (first login after approval)
  // Only initialize if: user is authenticated, no profile exists, and beta signup is approved
  React.useEffect(() => {
    // Wait for all queries to load before attempting initialization
    if (session === undefined || userProfile === undefined || betaSignup === undefined) {
      console.log("Waiting for queries to load...", { session: !!session, userProfile, betaSignup });
      return;
    }

    if (
      session?.user && 
      userProfile === null && 
      betaSignup?.status === "approved"
    ) {
      console.log("Auto-initializing new user after approval:", session.user.email);
      initializeUser()
        .then((result) => {
          console.log("initializeUser result:", result);
          if (!result.success) {
            console.error("User initialization failed:", result.message);
          }
        })
        .catch((error) => {
          console.error("User initialization error:", error);
        });
    } else {
      console.log("Skipping initialization:", {
        hasSession: !!session?.user,
        profileIsNull: userProfile === null,
        betaStatus: betaSignup?.status
      });
    }
  }, [session, userProfile, betaSignup, initializeUser]);

  // Auto-show onboarding modal when on /onboarding route, but only if onboarding isn't completed
  React.useEffect(() => {
    if (window.location.pathname === "/onboarding") {
      // Only show onboarding if it's not completed
      if (betaStatus && !betaStatus.onboardingCompleted) {
        onShowOnboarding();
      } else if (betaStatus && betaStatus.onboardingCompleted) {
        // Redirect to dashboard if onboarding is already completed
        window.history.replaceState({}, "", "/dashboard");
      }
    }
  }, [onShowOnboarding, betaStatus]);

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

  // Check if user needs onboarding
  // Show onboarding if:
  // 1. User has profile but onboarding not completed (betaStatus exists but onboardingCompleted is false)
  // 2. User just initialized (profile exists but onboarding hasn't started)
  const needsOnboarding = 
    (userProfile && betaStatus && !betaStatus.onboardingCompleted) ||
    (userProfile && betaStatus && betaStatus.status === "invited");

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

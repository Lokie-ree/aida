import React, { useState } from "react";
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { authClient } from "./lib/auth-client";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/shared/ModeToggle";
import { LandingPage } from "./components/shared/LandingPage";
import { Logo } from "./components/shared/Logo";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ProfileSettings } from "./components/dashboard/ProfileSettings";
import { Navigation } from "./components/shared/Navigation";
import { FrameworkLibrary } from "./components/framework/FrameworkLibrary";
import { BetaOnboarding } from "./components/dashboard/BetaOnboarding";
import { InnovationList } from "./components/community/InnovationList";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { TimeTracking } from "./components/dashboard/TimeTracking";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "frameworks" | "community" | "profile" | "admin" | "time-tracking">("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Authenticated>
          {/* Skip link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>

          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md h-16 border-b border-border shadow-lg">
            <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Logo className="h-8" />
              </div>
              <div className="flex items-center gap-4">
                <Navigation 
                  currentView={currentView} 
                  onViewChange={setCurrentView}
                />
                <div className="flex items-center gap-2">
                  <ModeToggle />
                  <SignOutButton />
                </div>
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1" role="main">
            <Content 
              currentView={currentView} 
              onShowOnboarding={() => setShowOnboarding(true)}
            />
          </main>

          {/* Beta Onboarding Modal */}
          <BetaOnboarding
            isOpen={showOnboarding}
            onClose={() => setShowOnboarding(false)}
            onComplete={() => {
              setShowOnboarding(false);
              // Optionally redirect to a specific view
            }}
          />
        </Authenticated>

        <Unauthenticated>
          <LandingPage />
        </Unauthenticated>

            <Toaster position="top-right" />
          </div>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

function Content({
  currentView,
  onShowOnboarding
}: {
  currentView: "dashboard" | "frameworks" | "community" | "profile" | "admin" | "time-tracking";
  onShowOnboarding: () => void;
}) {
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
  if (needsOnboarding && currentView === "dashboard") {
    onShowOnboarding();
  }

  switch (currentView) {
    case "dashboard":
      return (
        <Dashboard 
          user={user}
          stats={stats}
          recentFrameworks={frameworks.slice(0, 4)}
          featuredTestimonials={testimonials}
          onShowOnboarding={onShowOnboarding}
        />
      );
    case "frameworks":
      return <FrameworkLibrary />;
    case "community":
      return <InnovationList />;
    case "profile":
      return <ProfileSettings />;
    case "admin":
      return <AdminDashboard />;
    case "time-tracking":
      return <TimeTracking />;
    default:
      return <Dashboard 
        user={user}
        stats={stats}
        recentFrameworks={frameworks.slice(0, 4)}
        featuredTestimonials={testimonials}
        onShowOnboarding={onShowOnboarding}
      />;
  }
}

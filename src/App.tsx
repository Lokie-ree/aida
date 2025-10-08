import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/shared/ModeToggle";
import { LandingPage } from "./components/shared/LandingPage";
import { Logo } from "./components/shared/Logo";
import { Dashboard } from "./components/dashboard/Dashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "frameworks" | "profile">("dashboard");

  return (
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
              <div className="flex items-center gap-2 lg:gap-4">
                <ModeToggle />
                <SignOutButton />
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1" role="main">
            <Content currentView={currentView} />
          </main>
        </Authenticated>

        <Unauthenticated>
          <LandingPage />
        </Unauthenticated>

        <Toaster position="top-right" />
      </div>
    </ThemeProvider>
  );
}

function Content({ currentView }: { currentView: "dashboard" | "frameworks" | "profile" }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const frameworks = useQuery(api.frameworks.getAllFrameworks, {});
  const testimonials = useQuery(api.testimonials.getFeaturedTestimonials, {});
  const betaStats = useQuery(api.betaProgram.getBetaStats, {});

  if (loggedInUser === undefined || frameworks === undefined || testimonials === undefined || betaStats === undefined) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Initialize beta program for new users
  const initializeBeta = useMutation(api.betaProgram.initializeBetaProgram);

  // Mock data for now - in real implementation, this would come from user profile
  const user = {
    name: loggedInUser.name || "Educator",
    school: "Louisiana School District",
    subject: "Education"
  };

  const stats = {
    frameworksTried: betaStats?.frameworksTried || 0,
    timeSaved: betaStats?.totalTimeSaved || 0,
    innovationsShared: betaStats?.innovationsShared || 0,
    weeklyStreak: betaStats?.weeklyEngagementStreak || 0,
  };

  switch (currentView) {
    case "dashboard":
      return (
        <Dashboard 
          user={user}
          stats={stats}
          recentFrameworks={frameworks.slice(0, 4)}
          featuredTestimonials={testimonials}
        />
      );
    case "frameworks":
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Framework Library</h1>
          <p className="text-muted-foreground">Framework library coming soon...</p>
        </div>
      );
    case "profile":
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
          <p className="text-muted-foreground">Profile settings coming soon...</p>
        </div>
      );
    default:
      return <Dashboard 
        user={user}
        stats={stats}
        recentFrameworks={frameworks.slice(0, 4)}
        featuredTestimonials={testimonials}
      />;
  }
}

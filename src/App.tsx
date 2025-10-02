import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { SpaceSelector } from "./components/SpaceSelector";
import { OnboardingGuide } from "./components/OnboardingGuide";
import { CommandCenter } from "./components/CommandCenter";
import { ConversationPane } from "./components/ConversationPane";
import { PDDemoSetup } from "./components/PDDemoSetup";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ModeToggle";
import { Id } from "../convex/_generated/dataModel";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [currentSpaceId, setCurrentSpaceId] = useState<Id<"spaces"> | null>(null);

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

          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md h-16 border-b border-aida-primary-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-aida-primary-500 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    AI
                  </span>
                </div>
                <h1 className="text-xl font-bold text-aida-primary-600">
                  A.I.D.A.
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <ModeToggle />
                <SignOutButton />
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1 p-6" role="main">
            <div className="max-w-7xl mx-auto h-full">
              <Content currentSpaceId={currentSpaceId} setCurrentSpaceId={setCurrentSpaceId} />
            </div>
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

function Content({ currentSpaceId, setCurrentSpaceId }: { currentSpaceId: Id<"spaces"> | null; setCurrentSpaceId: (id: Id<"spaces"> | null) => void }) {
  const [showPDSetup, setShowPDSetup] = useState(true);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userSpaces = useQuery(api.spaces.getUserSpaces);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Auto-hide PD Setup if user already has 5+ spaces
  const shouldShowPDSetup = showPDSetup && (!userSpaces || userSpaces.length < 5);

  return (
    <>
      <OnboardingGuide
        currentSpaceId={currentSpaceId}
        onComplete={() => console.log("Onboarding completed")}
      />

      {/* Unified Dashboard Experience */}
      <div className="h-full flex flex-col gap-5">
        
        {/* PD Demo Setup Banner (Collapsible) */}
        {shouldShowPDSetup && (
          <div className="animate-slide-in-from-top">
            <PDDemoSetup
              onSpaceCreated={(spaceId) => setCurrentSpaceId(spaceId)}
              onComplete={() => setShowPDSetup(false)}
            />
          </div>
        )}

        {/* Workspace Control Panel - Refined */}
        <div className="bg-card rounded-2xl border shadow-md">
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  Active Workspace
                </h2>
                <p className="text-xs text-muted-foreground">
                  Switch Spaces to access role-specific knowledge
                </p>
              </div>
            </div>
            <SpaceSelector
              currentSpaceId={currentSpaceId}
              onSpaceChange={setCurrentSpaceId}
            />
          </div>
        </div>

        {/* Main Dashboard - Unified Layout with Visual Hierarchy */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-0">
          {/* Left Column: Command Center */}
          <div className="lg:col-span-1 flex flex-col min-h-0">
            <CommandCenter currentSpaceId={currentSpaceId} />
          </div>

          {/* Right Column: Conversation */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <ConversationPane currentSpaceId={currentSpaceId} />
          </div>
        </div>
      </div>
    </>
  );
}

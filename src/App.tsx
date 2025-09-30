import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { DocumentManager } from "./components/DocumentManager";
import { SpaceSelector } from "./components/SpaceSelector";
import { VoiceInterface } from "./components/VoiceInterface";
import { OnboardingGuide } from "./components/OnboardingGuide";
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
  const loggedInUser = useQuery(api.auth.loggedInUser);

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

  return (
    <>
      <OnboardingGuide
        currentSpaceId={currentSpaceId}
        onComplete={() => console.log("Onboarding completed")}
      />

      <div className="space-y-6">
        {/* Workspace Selector - Top of Dashboard */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <SpaceSelector
              currentSpaceId={currentSpaceId}
              onSpaceChange={setCurrentSpaceId}
            />
          </div>
        </div>

        {/* Main Dashboard - Clean Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Voice Button - Top Left */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <VoiceInterface
                currentSpaceId={currentSpaceId}
                className="shadow-lg border border-aida-primary-200"
              />
            </div>
          </div>

          {/* Knowledge Hub - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Document Management - Knowledge Hub */}
            <DocumentManager
              currentSpaceId={currentSpaceId}
              className="shadow-lg border border-aida-primary-200"
            />
          </div>
        </div>
      </div>
    </>
  );
}

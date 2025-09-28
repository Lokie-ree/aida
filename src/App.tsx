import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ChatInterface } from "./components/ChatInterface";
import { DocumentManager } from "./components/DocumentManager";
import { SpaceSelector } from "./components/SpaceSelector";
import { VoiceInterface } from "./components/VoiceInterface";
import { OnboardingGuide } from "./components/OnboardingGuide";
import { AidaFeedback } from "./AidaFeedback";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ModeToggle";
import { Id } from "../convex/_generated/dataModel";
import { designTokens } from "./lib/design-tokens";
import LandingPage from "./components/LandingPage";

export default function App() {
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

          <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-xs h-16 border-b shadow-xs">
            <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    AI
                  </span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  A.I.D.A.
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <ModeToggle />
                <SignOutButton />
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1 p-6" role="main">
            <div className="max-w-7xl mx-auto h-full">
              <Content />
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

function Content() {
  const [currentSpaceId, setCurrentSpaceId] = useState<Id<"spaces"> | null>(
    null
  );
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
        {/* Header - Space Selector */}
        <SpaceSelector
          currentSpaceId={currentSpaceId}
          onSpaceChange={setCurrentSpaceId}
        />

        {/* Main Content - Voice Interface and Core Features */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-0">
          {/* Left Column - Voice Interface (Primary Feature) */}
          <div className="xl:col-span-1 flex flex-col">
            <VoiceInterface
              currentSpaceId={currentSpaceId}
              className="flex-1 min-h-[400px]"
            />
          </div>

          {/* Right Column - Secondary Features */}
          <div className="xl:col-span-2 flex flex-col space-y-6 min-h-0">
            {/* Top Row - Chat Interface */}
            <div className="flex-1 min-h-[300px]">
              <ChatInterface currentSpaceId={currentSpaceId} />
            </div>

            {/* Bottom Row - Document Manager and AI Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
              <div className="flex flex-col">
                <DocumentManager currentSpaceId={currentSpaceId} />
              </div>
              <div className="flex flex-col">
                <AidaFeedback currentSpaceId={currentSpaceId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { VoiceHub } from "./components/VoiceHub";
import { ConversationPane } from "./components/ConversationPane";
import { ContextTray } from "./components/ContextTray";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ModeToggle";
import { LandingPage } from "./components/LandingPage";

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

          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md h-16 border-b border-border shadow-lg">
            <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-sm">
                    AI
                  </span>
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  EdCoachAI
                </h1>
              </div>
              <div className="flex items-center gap-2 lg:gap-4">
                <ModeToggle />
                <SignOutButton />
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1 p-4 sm:p-6" role="main">
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

      {/* Main Dashboard - New Layout */}
      <div className="h-full flex flex-col gap-4 sm:gap-6">
        {/* Row 1: Voice Hub + Conversation */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 min-h-0">
          {/* Voice Hub (1/3) */}
          <div className="lg:col-span-1 flex flex-col min-h-0">
            <VoiceHub
              onTranscription={(text) => console.log('Transcription:', text)}
              onResponse={(text) => console.log('Response:', text)}
              onDocumentAction={(action) => console.log('Document action:', action)}
              sourceCount={0}
              documentCount={0}
            />
          </div>

          {/* Conversation (2/3) */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <ConversationPane />
          </div>
        </div>

        {/* Row 2: Context Tray (full width) */}
        <div className="flex-shrink-0">
          <ContextTray
            documents={[]}
            sources={[]}
            activity={[]}
            onDocumentAction={(action, docId) => console.log('Document action:', action, docId)}
            onSourceClick={(sourceId) => console.log('Source clicked:', sourceId)}
            onActivityClick={(activityId) => console.log('Activity clicked:', activityId)}
          />
        </div>
      </div>
    </>
  );
}

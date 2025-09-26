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
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Skip to main content
      </a>
      
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xs h-16 flex justify-between items-center border-b shadow-xs px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">A.I.D.A.</h1>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      
      <main id="main-content" className="flex-1 p-6" role="main">
        <div className="max-w-7xl mx-auto h-full">
          <Content />
        </div>
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
}

function Content() {
  const [currentSpaceId, setCurrentSpaceId] = useState<Id<"spaces"> | null>(null);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Authenticated>
        <OnboardingGuide 
          currentSpaceId={currentSpaceId}
          onComplete={() => console.log("Onboarding completed")}
        />
        
        <div className="space-y-6">
          {/* Top Row - Voice Interface and Space Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VoiceInterface 
              currentSpaceId={currentSpaceId}
              className="h-64"
            />
            <SpaceSelector 
              currentSpaceId={currentSpaceId}
              onSpaceChange={setCurrentSpaceId}
            />
          </div>
          
          {/* Bottom Row - Chat Interface, Document Manager, and Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col min-h-[600px] lg:min-h-[calc(100vh-12rem)]">
              <ChatInterface currentSpaceId={currentSpaceId} />
            </div>
            
            <div className="flex flex-col min-h-[600px] lg:min-h-[calc(100vh-12rem)]">
              <DocumentManager currentSpaceId={currentSpaceId} />
            </div>
            
            <div className="flex flex-col min-h-[600px] lg:min-h-[calc(100vh-12rem)]">
              <AidaFeedback currentSpaceId={currentSpaceId} />
            </div>
          </div>
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="flex items-center justify-center h-full">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to A.I.D.A.</h2>
              <p className="text-lg text-gray-600 mb-6">
                Your AI-powered instructional design assistant with collaborative team spaces
              </p>
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Create shared spaces for team collaboration</li>
                  <li>• Upload and share curriculum documents with teammates</li>
                  <li>• Get contextual AI feedback based on shared knowledge</li>
                  <li>• Voice chat and persistent conversation history</li>
                  <li>• Web scraping to enhance team knowledge bases</li>
                </ul>
              </div>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}

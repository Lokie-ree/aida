import { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ChatInterface } from "./components/ChatInterface";
import { DocumentManager } from "./components/DocumentManager";
import { SpaceSelector } from "./components/SpaceSelector";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
      
      <main className="flex-1 p-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Column - Chat Interface */}
          <div className="flex flex-col min-h-[600px] lg:min-h-[calc(100vh-8rem)]">
            <ChatInterface currentSpaceId={currentSpaceId} />
          </div>
          
          {/* Right Column - Space Selector & Document Manager */}
          <div className="flex flex-col min-h-[600px] lg:min-h-[calc(100vh-8rem)] space-y-4">
            <SpaceSelector 
              currentSpaceId={currentSpaceId}
              onSpaceChange={setCurrentSpaceId}
            />
            <div className="flex-1">
              <DocumentManager currentSpaceId={currentSpaceId} />
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

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "./SignOutButton";
import { authClient } from "./lib/auth-client";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/shared/ModeToggle";
import { LandingPage } from "./components/shared/LandingPage";
import { Logo } from "./components/shared/Logo";
import { Navigation } from "./components/shared/Navigation";
import { BetaOnboarding } from "./components/dashboard/BetaOnboarding";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import DashboardRoute from "./components/routes/DashboardRoute";
import FrameworkRoute from "./components/routes/FrameworkRoute";
import CommunityRoute from "./components/routes/CommunityRoute";
import ProfileRoute from "./components/routes/ProfileRoute";
import AdminRoute from "./components/routes/AdminRoute";
import TimeTrackingRoute from "./components/routes/TimeTrackingRoute";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-background">
            {/* Skip link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>

            <Authenticated>
              <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md h-16 border-b border-border shadow-lg">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Logo className="h-8" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Navigation />
                    <div className="flex items-center gap-2">
                      <ModeToggle />
                      <SignOutButton />
                    </div>
                  </div>
                </div>
              </header>

              <main id="main-content" className="flex-1 pt-4" role="main">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardRoute onShowOnboarding={() => setShowOnboarding(true)} />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/frameworks" 
                    element={
                      <ProtectedRoute>
                        <FrameworkRoute />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/community" 
                    element={
                      <ProtectedRoute>
                        <CommunityRoute />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfileRoute />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminRoute />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/time-tracking" 
                    element={
                      <ProtectedRoute>
                        <TimeTrackingRoute />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
            </Authenticated>

            <Unauthenticated>
              <Routes>
                <Route path="/*" element={<LandingPage />} />
              </Routes>
            </Unauthenticated>

            {/* Beta Onboarding Modal */}
            <BetaOnboarding
              isOpen={showOnboarding}
              onClose={() => setShowOnboarding(false)}
              onComplete={() => {
                setShowOnboarding(false);
                // Optionally redirect to a specific view
              }}
            />

            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


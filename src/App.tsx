import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AppHeader } from "./components/shared/AppHeader";
import { LandingPage } from "./components/shared/LandingPage";
import { BetaOnboarding } from "./components/dashboard/BetaOnboarding";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { authClient } from "./lib/auth-client";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import DashboardRoute from "./components/routes/DashboardRoute";
import FrameworkRoute from "./components/routes/FrameworkRoute";
import CommunityRoute from "./components/routes/CommunityRoute";
import ProfileRoute from "./components/routes/ProfileRoute";
import AdminRoute from "./components/routes/AdminRoute";
import TimeTrackingRoute from "./components/routes/TimeTrackingRoute";

// Component to handle authenticated header with navigation
function AuthenticatedHeader() {
  const location = useLocation();
  const { data: session } = authClient.useSession();

  return (
    <AppHeader
      showAuthButtons={false}
      showNavigation={true}
      currentUser={session?.user}
    />
  );
}

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
              <AuthenticatedHeader />

              <main id="main-content" className="flex-1" role="main">
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
                    path="/frameworks/:frameworkId" 
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


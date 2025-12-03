import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AppHeader } from "./components/shared/AppHeader";
import { BetaOnboarding } from "./components/dashboard/BetaOnboarding";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { LoadingPage } from "./components/shared/LoadingStates";
import { authClient } from "./lib/auth-client";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import CoachRoute from "./components/routes/CoachRoute";

// Lazy load route components for code splitting
const SmartRedirect = lazy(() => import("./components/routes/SmartRedirect"));
const DashboardRoute = lazy(() => import("./components/routes/DashboardRoute"));
const ProfileSettings = lazy(() => import("./components/dashboard/ProfileSettings"));
const LandingPage = lazy(() => import("./components/shared/LandingPage"));
const PromptCoach = lazy(() => import("./components/coach/PromptCoach"));

// Component to handle authenticated header with navigation
function AuthenticatedHeader() {
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
          <div className="min-h-[100dvh] flex flex-col bg-background">
            {/* Skip link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px] min-w-[44px] flex items-center" // Added min-h and min-w for WCAG AA compliance
            >
              Skip to main content
            </a>

            <Authenticated>
              <AuthenticatedHeader />

              <main id="main-content" className="flex-1" role="main">
                <Suspense fallback={<LoadingPage />}>
                  <Routes>
                    <Route path="/" element={<SmartRedirect />} />
                    <Route
                      path="/coach"
                      element={
                        <ProtectedRoute>
                          <CoachRoute>
                            <PromptCoach />
                          </CoachRoute>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardRoute onShowOnboarding={() => setShowOnboarding(true)} />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfileSettings />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </main>
            </Authenticated>

            <Unauthenticated>
              <Suspense fallback={<LoadingPage />}>
                <Routes>
                  <Route path="/*" element={<LandingPage />} />
                </Routes>
              </Suspense>
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


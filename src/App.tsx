import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { LoadingPage } from "./components/shared/LoadingStates";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import CoachRoute from "./components/routes/CoachRoute";

// Lazy load route components
const LandingPage = lazy(() => import("./components/shared/LandingPage"));
const PromptCoach = lazy(() => import("./components/coach/PromptCoach"));
const ProfileSettings = lazy(() => import("./components/dashboard/ProfileSettings"));

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Authenticated>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                {/* Main app route - Coach is the default */}
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
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  }
                />
                {/* Redirect all other routes to coach */}
                <Route path="*" element={<Navigate to="/coach" replace />} />
              </Routes>
            </Suspense>
          </Authenticated>

          <Unauthenticated>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/*" element={<LandingPage />} />
              </Routes>
            </Suspense>
          </Unauthenticated>

          <Toaster position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

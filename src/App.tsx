import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { LoadingPage } from "./components/shared/LoadingStates";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { AuthenticatedLayout } from "./components/layout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy load route components
const LandingPage = lazy(() => import("./components/shared/LandingPage"));
const CoachPage = lazy(() =>
  import("./pages").then((m) => ({ default: m.CoachPage }))
);
const PromptsPage = lazy(() =>
  import("./pages").then((m) => ({ default: m.PromptsPage }))
);
const ProfilePage = lazy(() =>
  import("./pages").then((m) => ({ default: m.ProfilePage }))
);

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Authenticated>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/coach" element={<CoachPage />} />
                  <Route path="/coach/:conversationId" element={<CoachPage />} />
                  <Route path="/prompts" element={<PromptsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
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
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  );
}

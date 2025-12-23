import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { LoadingPage } from "./components/shared/LoadingStates";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { AuthenticatedLayout } from "./components/layout";

// Lazy load route components
const LandingPage = lazy(() => import("./components/landing/LandingPage"));
const CoachPage = lazy(() =>
  import("./pages").then((m) => ({ default: m.CoachPage }))
);
const PromptsPage = lazy(() =>
  import("./pages").then((m) => ({ default: m.PromptsPage }))
);
const ProfilePage = lazy(() =>
  import("./pages").then((m) => ({ default: m.ProfilePage }))
);

// Lazy load analytics to improve initial page load
function LazyAnalytics() {
  const [Analytics, setAnalytics] = useState<typeof import("@vercel/analytics/react").Analytics | null>(null);
  const [SpeedInsights, setSpeedInsights] = useState<typeof import("@vercel/speed-insights/react").SpeedInsights | null>(null);

  useEffect(() => {
    // Load analytics after page is interactive
    if (typeof window !== "undefined" && document.readyState === "complete") {
      Promise.all([
        import("@vercel/analytics/react").then((m) => m.Analytics),
        import("@vercel/speed-insights/react").then((m) => m.SpeedInsights),
      ]).then(([AnalyticsComponent, SpeedInsightsComponent]) => {
        setAnalytics(() => AnalyticsComponent);
        setSpeedInsights(() => SpeedInsightsComponent);
      });
    } else {
      // Wait for page to be fully loaded
      const handleLoad = () => {
        Promise.all([
          import("@vercel/analytics/react").then((m) => m.Analytics),
          import("@vercel/speed-insights/react").then((m) => m.SpeedInsights),
        ]).then(([AnalyticsComponent, SpeedInsightsComponent]) => {
          setAnalytics(() => AnalyticsComponent);
          setSpeedInsights(() => SpeedInsightsComponent);
        });
      };
      window.addEventListener("load", handleLoad, { once: true });
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <>
      {Analytics && <Analytics />}
      {SpeedInsights && <SpeedInsights />}
    </>
  );
}

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
      <LazyAnalytics />
    </ErrorBoundary>
  );
}

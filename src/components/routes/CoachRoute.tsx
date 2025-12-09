import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LoadingSpinner } from '../shared/LoadingStates';
import { authClient } from '@/lib/auth-client';
import { BetaOnboarding } from '../dashboard/BetaOnboarding';

interface CoachRouteProps {
  children: React.ReactNode;
}

export default function CoachRoute({ children }: CoachRouteProps) {
  const { isPending: isAuthLoading } = authClient.useSession();
  const profile = useQuery(api.userProfiles.getUserProfile);
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Determine if onboarding should be shown (safe to calculate even if profile is undefined)
  // Show onboarding if profile is loaded and:
  // 1. Profile doesn't exist (null) - new user, OR
  // 2. Profile exists but onboarding not complete (onboardingComplete flag is false/undefined), OR
  // 3. Profile is incomplete (missing required fields: subject or gradeLevel)
  // Note: school is optional, only subject and gradeLevel are required
  const shouldShowOnboarding = 
    profile !== undefined && (
      profile === null ||
      !profile.onboardingComplete || 
      !profile.gradeLevel || 
      !profile.subject
    );

  // Show onboarding modal when conditions are met
  // This hook must be called before any early returns (Rules of Hooks)
  useEffect(() => {
    if (shouldShowOnboarding && !showOnboarding) {
      setShowOnboarding(true);
    } else if (!shouldShowOnboarding && showOnboarding) {
      // Close modal if onboarding is now complete
      setShowOnboarding(false);
    }
  }, [shouldShowOnboarding, showOnboarding]);

  // Wait for auth to be ready (especially important when processing magic link tokens)
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Wait for profile to load
  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Force a refresh of the profile query to get updated data
    // The component will re-render and check profile again
  };

  // Show onboarding modal if needed (new user or incomplete profile)
  // Always show children - onboarding modal overlays on top
  return (
    <>
      {children}
      {shouldShowOnboarding && showOnboarding && (
        <BetaOnboarding
          isOpen={showOnboarding}
          onClose={() => {
            // Don't allow closing if onboarding is not complete - user must complete all steps
            if (profile && profile.onboardingComplete) {
              setShowOnboarding(false);
            }
            // If onboarding is not complete, do nothing (modal stays open)
          }}
          onComplete={handleOnboardingComplete}
        />
      )}
    </>
  );
}


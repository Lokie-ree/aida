import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LoadingSpinner } from '../shared/LoadingStates';
import { authClient } from '@/lib/auth-client';

interface CoachRouteProps {
  children: React.ReactNode;
}

export default function CoachRoute({ children }: CoachRouteProps) {
  const { isPending: isAuthLoading } = authClient.useSession();
  const profile = useQuery(api.userProfiles.getUserProfile);
  const location = useLocation();

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

  // Check if profile exists and has required fields
  // profile is null if not found
  if (!profile || !profile.gradeLevel || !profile.subject) {
    return <Navigate to="/profile" state={{
      message: "Please complete your profile to access the coach.",
      returnTo: location.pathname
    }} replace />;
  }

  return <>{children}</>;
}


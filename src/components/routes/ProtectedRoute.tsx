import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { authClient } from '../../lib/auth-client';
import { api } from '../../../convex/_generated/api';
import { LoadingSpinner } from '../shared/LoadingStates';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { data: session, isPending: isLoading } = authClient.useSession();
  
  // Safely extract user - ensure session is an object before accessing user
  const user = session && typeof session === 'object' && 'user' in session 
    ? (session as any).user 
    : undefined;
  
  // Admin functionality removed - always return false for admin checks
  const isAdmin = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/coach" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

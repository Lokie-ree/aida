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
  
  // Always call useQuery (hooks must be called unconditionally)
  // But we only use the result if requireAdmin is true
  const isAdminQueryResult = useQuery(api.admin.checkIsAdmin);
  
  // Safely convert query result to boolean
  // useQuery returns undefined when loading, boolean when loaded
  // Check for error objects or unexpected types before using
  let isAdmin = false;
  let isAdminLoading = false;
  
  if (requireAdmin) {
    // Use strict equality checks to avoid type coercion issues
    if (isAdminQueryResult === undefined || isAdminQueryResult === null) {
      isAdminLoading = true;
    } else if (isAdminQueryResult === true || isAdminQueryResult === false) {
      isAdmin = isAdminQueryResult === true;
      isAdminLoading = false;
    } else {
      // If it's not undefined, null, or boolean (e.g., error object), default to false
      isAdmin = false;
      isAdminLoading = false;
    }
  }

  if (isLoading || isAdminLoading) {
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
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

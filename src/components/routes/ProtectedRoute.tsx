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
  const user = session?.user;
  const isAdmin = useQuery(api.admin.checkIsAdmin);

  if (isLoading || (requireAdmin && isAdmin === undefined)) {
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

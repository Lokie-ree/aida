import { Navigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LoadingSpinner } from '../shared/LoadingStates';

/**
 * SmartRedirect Component
 * 
 * Intelligently redirects authenticated users based on their role:
 * - Admin users → /admin
 * - Regular users → /dashboard
 * 
 * This ensures admins land on the admin dashboard after login
 * instead of being redirected to the regular dashboard.
 */
function SmartRedirect() {
  const isAdmin = useQuery(api.admin.checkIsAdmin);

  // Show loading while checking admin status
  if (isAdmin === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect based on admin status
  return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
}

export default SmartRedirect;


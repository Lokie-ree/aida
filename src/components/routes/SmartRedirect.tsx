import { Navigate } from 'react-router-dom';

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
  // Admin functionality removed - always redirect to dashboard
  return <Navigate to="/dashboard" replace />;
}

export default SmartRedirect;


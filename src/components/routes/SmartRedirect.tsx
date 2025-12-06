import { Navigate } from 'react-router-dom';

/**
 * SmartRedirect Component
 * 
 * Redirects authenticated users to the coach interface.
 * Teachers log in and land directly on the Prompt Coach.
 */
function SmartRedirect() {
  return <Navigate to="/coach" replace />;
}

export default SmartRedirect;


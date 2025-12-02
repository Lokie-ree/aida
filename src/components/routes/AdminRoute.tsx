import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute: React.FC = () => {
  // Admin functionality removed - redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;

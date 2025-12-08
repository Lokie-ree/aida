import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute: React.FC = () => {
  // Admin functionality removed - redirect to coach
  return <Navigate to="/coach" replace />;
};

export default AdminRoute;

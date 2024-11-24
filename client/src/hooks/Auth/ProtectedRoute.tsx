// File: /src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasRequiredRole, setHasRequiredRole] = useState<boolean>(false);
  
  const decodedToken = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token && !decodedToken) {
      setIsAuthenticated(false);
      return;
    }

    if (requiredRole) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
    setHasRequiredRole(true);
  }, [token, decodedToken, requiredRole]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Hoặc một spinner để hiển thị trong khi chờ xác thực
  }

  if (!isAuthenticated || (requiredRole && !hasRequiredRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

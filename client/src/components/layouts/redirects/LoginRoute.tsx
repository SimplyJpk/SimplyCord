import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const LoginRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default LoginRoute;
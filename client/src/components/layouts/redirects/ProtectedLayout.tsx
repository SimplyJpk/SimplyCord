import useAuth from '../../../hooks/useAuth';

import { Outlet, Navigate } from 'react-router-dom';

const ProtectedLayout = () => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
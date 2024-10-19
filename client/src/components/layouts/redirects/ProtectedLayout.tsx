import useAuth from '../../../hooks/useAuth';

import { Outlet, Navigate } from 'react-router-dom';

const ProtectedLayout = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated && !auth.isLoading) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
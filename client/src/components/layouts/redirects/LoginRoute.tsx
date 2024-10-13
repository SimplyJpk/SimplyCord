import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import type { AppDispatch } from '../../../store/store.ts';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
// Slice
import { fetchUserProfile } from '../../../slices/authSlice';

const LoginRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();

  const isAuthenticated = useAuth();
  const location = useLocation();

  const auth = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/" />;
    }
  } else if (auth.token) {
    dispatch(fetchUserProfile());
  }

  return <>{children}</>;
};

export default LoginRoute;
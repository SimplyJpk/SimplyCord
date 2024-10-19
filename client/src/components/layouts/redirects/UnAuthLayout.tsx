import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import type { AppDispatch } from '../../../store/store';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
// Slice
import { fetchMe } from '../../../slices/userSlice';

const UnAuthLayout = () => {
  const dispatch: AppDispatch = useDispatch();

  // TODO: (James) Clean this up a bit
  const isAuthenticated = useAuth();
  const location = useLocation();

  const auth = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated.isLoading && isAuthenticated.isAuthenticated) {
    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/" replace={true} />;
    }
  } else if (!isAuthenticated.isLoading && auth.token) {
    dispatch(fetchMe());
  }

  return <Outlet />;
};

export default UnAuthLayout;
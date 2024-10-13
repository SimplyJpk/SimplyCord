import { Middleware } from '@reduxjs/toolkit';
import { selectToken, selectIsAuthenticated, fetchUserProfile } from '@slices/authSlice';

const tokenWatcherMiddleware: Middleware = (storeAPI) => (next) => async (action) => {
  const previousToken = selectToken(storeAPI.getState());
  const previousIsAuthenticated = selectIsAuthenticated(storeAPI.getState());

  const result = next(action);

  const currentToken = selectToken(storeAPI.getState());
  const currentIsAuthenticated = selectIsAuthenticated(storeAPI.getState());

  if (previousToken !== currentToken && !currentIsAuthenticated) {
    console.log('Token changed, fetching user profile');
    storeAPI.dispatch(fetchUserProfile());
  }

  return result;
};

export default tokenWatcherMiddleware;
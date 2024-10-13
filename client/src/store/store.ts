import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
// import { composeWithDevTools } from 'redux-devtools-extension'; // TODO: (James) Add

import tokenWatcherMiddleware from '@middleware/tokenWatcherMiddleware'

import appReducer from '@slices/app';
import messagesReducer from '@slices/messageSlice';
import serversReducer from '@slices/serverSlice';
import authReducer from '@slices/authSlice';
import userReducer from '@slices/userSlice';

const combinedReducers = combineReducers({
  app: appReducer,
  messages: messagesReducer,
  servers: serversReducer,
  user: userReducer,
  auth: authReducer,
});

const store = configureStore({
  reducer: combinedReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    tokenWatcherMiddleware,
    logger,
  ]
  ),
  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
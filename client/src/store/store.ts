import { configureStore } from '@reduxjs/toolkit';

import messagesReducer from '../../src/slices/messageSlice';
import serversReducer from '../../src/slices/serverSlice';
import authReducer from '../../src/slices/authSlice';
import userReducer from '../../src/slices/userSlice';

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    servers: serversReducer,
    user: userReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
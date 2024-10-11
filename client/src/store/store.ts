import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from '../../src/slices/messageSlice';
import serversReducer from '../../src/slices/serverSlice';

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    servers: serversReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
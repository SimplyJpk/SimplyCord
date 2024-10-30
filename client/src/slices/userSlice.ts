import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../network/axios';

import { UserAttributes } from '@shared/models/user';
import { ServerUsersAttributes } from '@shared/models/serverUsers';

// Multi-purpose slice, auth is for validation, but there is a user user/me route that is used to get self info, and another user/get/:id route to get a user by id
interface UserState {
  user: UserAttributes | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  onlineUsers: string[];
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
  onlineUsers: [],
};

export const fetchMe = createAsyncThunk('user/me', async () => {
  const response = await axiosInstance.get('/user/me');
  return response.data;
});

export const updateServerOrder = createAsyncThunk('user/updateServerOrder', async (serverUsers: ServerUsersAttributes[]) => {
  const response = await axiosInstance.put('/user/server/order', serverUsers);
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(updateServerOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateServerOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(updateServerOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update server order';
      });
  },
});

export const { setOnlineUsers } = userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state) => state.user.user;
export const selectUserServers = (state) => state.user.user?.serverUsers ?? [];

export type { UserState };
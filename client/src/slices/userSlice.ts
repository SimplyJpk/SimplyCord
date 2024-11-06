import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../network/axios';

import { UserAttributes } from '@shared/models/user';
import { ServerUsersAttributes } from '@shared/models/serverUsers';

// Resources
import DefaultAvatar from '../assets/icons/profile.png';

// Multi-purpose slice, auth is for validation, but there is a user user/me route that is used to get self info, and another user/get/:id route to get a user by id
interface UserState {
  user: UserAttributes | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  onlineUsers: string[];
  profilePictures: { [userId: number]: string };
  profilePictureRequests: { [userId: number]: boolean };
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
  onlineUsers: [],
  profilePictures: {},
  profilePictureRequests: {},
};

export const fetchMe = createAsyncThunk('user/me', async () => {
  const response = await axiosInstance.get('/user/me');
  return response.data;
});

export const updateServerOrder = createAsyncThunk('user/updateServerOrder', async (serverUsers: ServerUsersAttributes[]) => {
  const response = await axiosInstance.put('/user/server/order', serverUsers);
  return response.data;
});

export const fetchUserProfilePicture = createAsyncThunk(
  'user/fetchUserProfilePicture',
  async (userId: number, { getState, dispatch }) => {
    const state = getState() as { user: UserState };
    if (state.user.profilePictureRequests[userId]) {
      return; // Request already in progress
    }

    dispatch(setProfilePictureRequestInProgress({ userId, inProgress: true }));

    const response = await axiosInstance.get(`/user/profile-picture/${userId}`, {
      responseType: 'blob'
    });

    if (response.status === 200) {
      return { userId, url: URL.createObjectURL(response.data) };
    } else {
      return { userId, url: DefaultAvatar };
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setProfilePictureRequestInProgress: (state, action) => {
      state.profilePictureRequests[action.payload.userId] = action.payload.inProgress;
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
      })
      .addCase(fetchUserProfilePicture.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfilePicture.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.meta.arg) {
          state.profilePictures[action.meta.arg] = action.payload.url;
        }
        state.profilePictureRequests[action.meta.arg] = false;
      })
      .addCase(fetchUserProfilePicture.rejected, (state, action) => {
        state.status = 'failed';
        if (!state.profilePictures[action.meta.arg]) {
          state.profilePictures[action.meta.arg] = DefaultAvatar;
        }
        state.profilePictureRequests[action.meta.arg] = false;
      });
  },
});

export const { setOnlineUsers, setProfilePictureRequestInProgress } = userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state) => state.user.user;
export const selectUserServers = (state) => state.user.user?.serverUsers ?? [];
export const selectUserProfilePicture = (state, userId) => state.user.profilePictures[userId];

export type { UserState };
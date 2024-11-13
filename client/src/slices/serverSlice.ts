import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../network/axios';

import { ServerAttributes } from '@shared/models/server';
import { UserAttributes } from '@shared/models/user';

import { fetchMe } from './userSlice';

// Resources
import DefaultAvatar from '../assets/icons/profile.png';

import { getStaticOrigin } from './app';

interface ServersState {
  publicServers: ServerAttributes[];
  selectedServersUserList: UserAttributes[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServersState = {
  publicServers: [],
  selectedServersUserList: [],
  status: 'idle',
  error: null,
};

export const fetchPublicServers = createAsyncThunk('servers/fetchPublicServers', async () => {
  const response = await axiosInstance.get('/servers');
  return response.data;
});

export const fetchServerUsers = createAsyncThunk('servers/fetchServerUsers', async (serverId: string) => {
  const response = await axiosInstance.get(`/servers/${serverId}/users`);
  return response.data;
});

export const joinServer = createAsyncThunk('servers/joinServer', async (serverId: number, { dispatch }) => {
  const response = await axiosInstance.post(`/servers/${serverId}/join`);
  if (response.data.success) {
    dispatch(fetchMe());
  }
  return response.data;
});

export const fetchServerMessages = createAsyncThunk('messages/fetchServerMessages', async (serverId: string) => {
  const response = await axiosInstance.get(`/servers/${serverId}/messages`);
  return response.data;
});

const serversSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicServers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicServers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.publicServers = action.payload;
      })
      .addCase(fetchPublicServers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch servers';
      })
      .addCase(fetchServerUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServerUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedServersUserList = action.payload;
      })
      .addCase(fetchServerUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch server users';
        state.selectedServersUserList = [];
      })
      .addCase(joinServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(joinServer.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(joinServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to join server';
      })
      .addCase(fetchServerMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServerMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(fetchServerMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch server messages';
      });
  },
});

export default serversSlice.reducer;

export const selectPublicServers = (state) => state.servers.publicServers;
export const selectSelectedServersUserList = (state) => state.servers.selectedServersUserList;
export const getUserById = (state, userId: number) => state.servers.selectedServersUserList.find((user) => user.id === userId);
export const getServerByID = (state, serverId: number) => state.servers.publicServers.find((server) => server.id === serverId);

export type { ServersState };
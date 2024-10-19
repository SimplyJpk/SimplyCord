import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../network/axios';

import { ServerAttributes } from '@shared/models/server';
import { UserAttributes } from '@shared/models/user';

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

export const fetchServerUsers = createAsyncThunk('servers/fetchServerUsers', async (serverId: number) => {
  const response = await axiosInstance.get(`/servers/${serverId}/users`);
  return response.data;
});

export const joinServer = createAsyncThunk('servers/joinServer', async (serverId: number) => {
  const response = await axiosInstance.post(`/servers/${serverId}/join`);
  return response.data;
});

const serversSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {},
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
      })
      .addCase(joinServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(joinServer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedServersUserList = action.payload;
      })
      .addCase(joinServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to join server';
        state.selectedServersUserList = [];
      });
  },
});

export default serversSlice.reducer;

export const selectPublicServers = (state) => state.servers.publicServers;
export const selectSelectedServersUserList = (state) => state.servers.selectedServersUserList;

export type { ServersState };
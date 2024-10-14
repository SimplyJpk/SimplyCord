import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../network/axios';

import { ServerAttributes } from '@shared/models/server';
import { UserAttributes } from '@shared/models/user';

interface ServersState {
  servers: ServerAttributes[];
  selectedServersUserList: UserAttributes[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServersState = {
  servers: [],
  selectedServersUserList: [],
  status: 'idle',
  error: null,
};

export const fetchServers = createAsyncThunk('servers/fetchServers', async () => {
  const response = await axiosInstance.get('/servers');
  return response.data;
});

export const fetchServerUsers = createAsyncThunk('servers/fetchServerUsers', async (serverId: number) => {
  const response = await axiosInstance.get(`/servers/${serverId}/users`);
  return response.data;
});

const serversSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.servers = action.payload;
      })
      .addCase(fetchServers.rejected, (state, action) => {
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
      });
  },
});

export default serversSlice.reducer;

export const selectServers = (state) => state.servers.servers;
export const selectSelectedServersUserList = (state) => state.servers.selectedServersUserList;

export type { ServersState };
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@root/axios';

import { ServerAttributes } from '@shared/models/server';

interface ServersState {
  servers: ServerAttributes[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServersState = {
  servers: [],
  status: 'idle',
  error: null,
};

export const fetchServers = createAsyncThunk('servers/fetchServers', async () => {
  const response = await axiosInstance.get('/servers');
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
      });
  },
});

export default serversSlice.reducer;

export type { ServersState };
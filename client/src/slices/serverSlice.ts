import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../network/axios';

import { ServerAttributes } from '@shared/models/server';
import { UserAttributes } from '@shared/models/user';

import { fetchMe } from './userSlice';

// Resources
import DefaultAvatar from '../assets/icons/profile.png';

interface ServersState {
  publicServers: ServerAttributes[];
  selectedServersUserList: UserAttributes[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  icons: { [serverId: number]: string };
  banners: { [serverId: number]: string };
  iconRequests: { [serverId: number]: boolean };
  bannerRequests: { [serverId: number]: boolean };
}

const initialState: ServersState = {
  publicServers: [],
  selectedServersUserList: [],
  status: 'idle',
  error: null,
  icons: {},
  banners: {},
  iconRequests: {},
  bannerRequests: {},
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

export const fetchServerPicture = createAsyncThunk(
  'servers/fetchServerPicture',
  async (serverId: number, { getState, dispatch }) => {
    const state = getState() as { servers: ServersState };
    if (state.servers.iconRequests[serverId]) {
      return; // Request already in progress
    }

    dispatch(setIconRequestInProgress({ serverId, inProgress: true }));

    const response = await axiosInstance.get(`/servers/icon/${serverId}`, {
      responseType: 'blob'
    });

    if (response.status === 200) {
      return { serverId, url: URL.createObjectURL(response.data) };
    } else {
      return { serverId, url: DefaultAvatar };
    }
  }
);

export const fetchServerBanner = createAsyncThunk(
  'servers/fetchServerBanner',
  async (serverId: number, { getState, dispatch }) => {
    const state = getState() as { servers: ServersState };
    if (state.servers.bannerRequests[serverId]) {
      return; // Request already in progress
    }

    dispatch(setBannerRequestInProgress({ serverId, inProgress: true }));

    const response = await axiosInstance.get(`/servers/banner/${serverId}`, {
      responseType: 'blob'
    });

    if (response.status === 200) {
      return { serverId, url: URL.createObjectURL(response.data) };
    } else {
      return { serverId, url: DefaultAvatar };
    }
  }
);

const serversSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {
    setIconRequestInProgress: (state, action) => {
      state.iconRequests[action.payload.serverId] = action.payload.inProgress;
    },
    setBannerRequestInProgress: (state, action) => {
      state.bannerRequests[action.payload.serverId] = action.payload.inProgress;
    },
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
      })
      .addCase(fetchServerPicture.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchServerPicture.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.icons[action.payload.serverId] = action.payload.url;
        state.iconRequests[action.payload.serverId] = false;
      })
      .addCase(fetchServerPicture.rejected, (state, action) => {
        state.status = 'failed';
        state.icons[action.meta.arg] = DefaultAvatar;
        state.iconRequests[action.meta.arg] = false;
      })
      .addCase(fetchServerBanner.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchServerBanner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.banners[action.payload.serverId] = action.payload.url;
        state.bannerRequests[action.payload.serverId] = false;
      })
      .addCase(fetchServerBanner.rejected, (state, action) => {
        state.status = 'failed';
        state.banners[action.meta.arg] = DefaultAvatar;
        state.bannerRequests[action.meta.arg] = false;
      });
  },
});

export const { setIconRequestInProgress, setBannerRequestInProgress } = serversSlice.actions;

export default serversSlice.reducer;

export const selectPublicServers = (state) => state.servers.publicServers;
export const selectSelectedServersUserList = (state) => state.servers.selectedServersUserList;
export const selectServerPicture = (state, serverId) => state.servers.icons[serverId];
export const selectServerBanner = (state, serverId) => state.servers.banners[serverId];

export type { ServersState };
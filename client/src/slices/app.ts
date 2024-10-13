// App Slice, for global state
import { createSlice } from '@reduxjs/toolkit';

interface AppState {
  isBusy: boolean;
  currentServerId: number | null;
  currentServerChannelId: string | null;
}

const initialState: AppState = {
  isBusy: false,
  currentServerId: null,
  currentServerChannelId: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setBusy(state, action) {
      state.isBusy = action.payload;
    },
    setCurrentServer(state, action) {
      state.currentServerId = action.payload;
    },
    setCurrentServerChannel(state, action) {
      state.currentServerChannelId = action.payload;
    },
  },
});

export const { setBusy, setCurrentServer, setCurrentServerChannel } = appSlice.actions;

export const selectIsBusy = (state) => state.app.isBusy;
export const selectCurrentServerId = (state) => state.app.currentServerId;
export const selectCurrentServerChannelId = (state) => state.app.currentServerChannelId;

export default appSlice.reducer;

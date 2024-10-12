import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios';

import { setAuthToken } from '../../axios';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  // TODO: (James) Move to User Slice, likely some user/me route
  userId: number | null;
  username: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  status: 'idle',
  error: null,
  userId: null,
  username: null,
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post('/user/login', credentials);
  return response.data;
});

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk('auth/registerUser', async (credentials: RegisterCredentials) => {
  const response = await axiosInstance.post('/user/register', credentials);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.username = action.payload.username;
        setAuthToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.username = action.payload.username;
        setAuthToken(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to register';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
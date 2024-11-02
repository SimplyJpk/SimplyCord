import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, { setAuthToken } from '../network/axios';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  status: 'idle',
  error: null,
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
  file: File | null;
}

export const registerUser = createAsyncThunk('auth/registerUser', async (credentials: RegisterCredentials) => {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('email', credentials.email);
  formData.append('password', credentials.password);
  if (credentials.file) {
    formData.append('file', credentials.file);
  }
  const response = await axiosInstance.post('/user/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});

export const fetchUserProfile = createAsyncThunk('user/me', async () => {
  const response = await axiosInstance.get('/user/me');
  return response;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
    },
    setAuthSuccess(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    setAuthFailure(state) {
      state.isAuthenticated = false;
      state.token = null;
    },
    clearAuth(state) {
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
        setAuthToken(action.payload.token);
        state.isAuthenticated = true;
        state.token = action.payload.token;
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
        setAuthToken(action.payload.token);
        state.isAuthenticated = true;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to register';
      });
  },
});

export const {
  logout,
  setAuthSuccess,
  setAuthFailure,
  clearAuth,
} = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;

export type { AuthState };
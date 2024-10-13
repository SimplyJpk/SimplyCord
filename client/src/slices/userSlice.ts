import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios';

import { UserAttributes } from '@shared/models/user';

// Multi-purpose slice, auth is for validation, but there is a user user/me route that is used to get self info, and another user/get/:id route to get a user by id
interface UserState {
  user: UserAttributes | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  },
});

export default userSlice.reducer;

export type { UserState };
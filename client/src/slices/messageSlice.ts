import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios';

import { MessageAttributes } from '@shared/models/message';

interface MessagesState {
  messages: MessageAttributes[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  status: 'idle',
  error: null,
};

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async () => {
  const response = await axiosInstance.get('/messages');
  return response.data;
});

export const fetchServerMessages = createAsyncThunk('messages/fetchServerMessages', async (serverId: number) => {
  const response = await axiosInstance.get(`/messages/${serverId}`);
  return response.data;
});

export const sendMessage = createAsyncThunk('messages/sendMessage', async (message: string) => {
  const response = await axiosInstance.post('/messages', { message });
  return response.data;
});


// TODO: (James) Bulky?
interface SendMessagePayload {
  message: string;
  serverId: number;
}

export const sendMessageToServer = createAsyncThunk(
  'messages/sendMessageToServer',
  async ({ message, serverId }: SendMessagePayload) => {
    const response = await axiosInstance.post(`/messages/${serverId}`, { message });
    return response.data;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // TODO: (James) What is correct way of doing this, surely not 5000 lines of the same stuff
    // TODO: (James) Reduce boiler plate, maybe a generator/template?
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to send message';
      })
      .addCase(fetchServerMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchServerMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchServerMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch messages';
        state.messages = [];
      })
      .addCase(sendMessageToServer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessageToServer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push(action.payload);
      })
      .addCase(sendMessageToServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export default messagesSlice.reducer;
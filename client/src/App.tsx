import { useState } from 'react'
import { useEffect } from 'react';
import { RootState } from './store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './store/store.ts';
import { fetchMessages, sendMessage } from './slices/messageSlice.ts';
import './App.css'
// Uses UnoCSS

// App component
import InputBar from './components/InputBar';
import Message from './components/Message';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.messages.messages);
  const messageStatus = useSelector((state: RootState) => state.messages.status);

  // send message
  const sendMessageHandler = (message: string) => {
    dispatch(sendMessage(message));
  };

  useEffect(() => {
    if (messageStatus === 'idle') {
      dispatch(fetchMessages());
    }
  }, [messageStatus, dispatch]);

  // max height of 100vh
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow w-full overflow-auto bg-blueGray-800">
        <div className="p-2 text-white flex flex-col gap-1">
          {messages.map((message: Message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
      </div>
      <InputBar onSubmit={sendMessageHandler} />
    </div>
  )
}

export default App

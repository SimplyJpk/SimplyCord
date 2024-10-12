import { useState, useEffect, useRef } from 'react'
import { RootState } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './store/store.ts';
import { fetchMessages, fetchServerMessages, sendMessage, sendMessageToServer } from './slices/messageSlice';
import { fetchServers } from './slices/serverSlice';
import './App.css'

// App component
import InputBar from './components/InputBar';
import Message from './components/Message';
import ServerList from './components/ServerList';

import { ServerAttributes } from '@shared/models/server';

function App() {
  const dispatch: AppDispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.messages.messages);
  const messageStatus = useSelector((state: RootState) => state.messages.status);
  const servers = useSelector((state: RootState) => state.servers.servers);
  const auth = useSelector((state: RootState) => state.auth);

  // Refs
  const inputMessageRef = useRef<HTMLInputElement>(null);
  // State
  const [currentServer, setCurrentServer] = useState<ServerAttributes | null>(null);
  // Effects
  useEffect(() => {
    if (messageStatus === 'idle') {
      dispatch(fetchMessages());
    }
  }, [messageStatus, dispatch]);

  useEffect(() => {
    dispatch(fetchServers());
  }, [dispatch]);

  useEffect(() => {
    if (currentServer) {
      dispatch(fetchServerMessages(currentServer.id));
      if (inputMessageRef.current) {
        inputMessageRef.current.focus();
      }
    }
  }, [currentServer, dispatch]);

  // Handlers
  const sendMessageHandler = (message: string) => {
    if (currentServer) {
      dispatch(sendMessageToServer({ message, serverId: currentServer.id, userId: auth.userId }));
    } else {
      dispatch(sendMessage(message));
    }
  };

  const onServerSelect = (server: ServerAttributes) => {
    setCurrentServer(server);
  };

  return (
    <div className="flex w-screen h-screen">
      <ServerList onServerSelect={onServerSelect} />
      <div className="flex flex-col w-full h-full">
        <div className="flex-grow w-full overflow-auto bg-blueGray-800">
          <div className="p-2 text-white flex flex-col gap-1">
            {!currentServer && (
              <div className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm h-16 w-16 cursor-pointer hover:bg-gray-200 w-full">
                <p className="text-black">
                  Select a server
                </p>
              </div>
            )}
            {currentServer && messages.map((message: Message, index) => (
              <Message key={index} message={message} />
            ))}
          </div>
        </div>
        <InputBar
          onSubmit={sendMessageHandler}
          inputRef={inputMessageRef}
        />
      </div>
    </div>
  )
}

export default App

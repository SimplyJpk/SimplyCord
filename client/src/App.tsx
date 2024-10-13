import { useState, useEffect, useRef } from 'react'
import { RootState } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './store/store.ts';
import { fetchServerMessages, sendMessageToServer } from './slices/messageSlice';
import { fetchMe } from './slices/userSlice';
import { fetchServers } from './slices/serverSlice';
import './App.css'
// Slice
import {
  setCurrentServer,
  selectCurrentServerId
} from './slices/app';
// App component
import InputBar from './components/InputBar';
import ServerList from './components/ServerList';
import ServerSideBar from './components/layouts/serverSideBar/ServerSideBar';
import MessageList from './components/chat/MessageList';
import UserSideBar from './components/layouts/serverSideBar/UserSideBar';

import { ServerAttributes } from '@shared/models/server';

function App() {
  // Dispatch
  const dispatch: AppDispatch = useDispatch();
  // Selectors
  const messages = useSelector((state: RootState) => state.messages.messages);
  const messageStatus = useSelector((state: RootState) => state.messages.status);
  const servers = useSelector((state: RootState) => state.servers.servers);
  const user = useSelector((state: RootState) => state.user.user);
  const auth = useSelector((state: RootState) => state.auth);

  const currentServerId = useSelector(selectCurrentServerId);

  // Refs
  const inputMessageRef = useRef<HTMLInputElement>(null);
  // State


  useEffect(() => {
    dispatch(fetchServers());
  }, [dispatch]);

  useEffect(() => {
    if (currentServerId !== null) {
      dispatch(fetchServerMessages(currentServerId));
      if (inputMessageRef.current) {
        inputMessageRef.current.focus();
      }
    }
  }, [currentServerId, dispatch]);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  // Handlers
  const sendMessageHandler = (message: string) => {
    if (currentServerId) {
      dispatch(sendMessageToServer({ message, serverId: currentServerId }));
    }
  };

  const onServerSelect = (server: ServerAttributes) => {
    dispatch(setCurrentServer(server.id));
  };

  return (
    <div className="flex w-screen h-screen">
      <ServerList onServerSelect={onServerSelect} />
      <ServerSideBar server={servers.find((server) => server.id === currentServerId)} user={user} />
      <div className="flex flex-col w-full h-full">
        <div className="flex-grow w-full overflow-auto bg-blueGray-800">
          <div className="p-2 text-white flex flex-col gap-1">
            {!currentServerId && (
              <div className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm h-16 w-16 cursor-pointer hover:bg-gray-200 w-full">
                <p className="text-black">
                  Select a server
                </p>
              </div>
            )}
            {currentServerId && (
              <MessageList
                messages={messages}
                isLoading={false} // TODO: (James) Add loading state that is aware of server changes, don't isLoading if only message loading
              />
            )}
          </div>
        </div>
        <InputBar
          onSubmit={sendMessageHandler}
          inputRef={inputMessageRef}
          disabled={!currentServerId}
        />
      </div>
      <UserSideBar />
    </div>
  )
}

export default App

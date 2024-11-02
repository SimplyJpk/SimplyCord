import { useState, useEffect, useRef } from 'react'
import { RootState } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './store/store.ts';
import { fetchServerMessages, sendMessageToServer } from './slices/messageSlice';
import { fetchMe, setOnlineUsers } from './slices/userSlice';
import { fetchPublicServers } from './slices/serverSlice';
import WebSocketClient from './network/webSocket';

const { VITE_APP_WEBSOCKET_URL } = import.meta.env;
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
// Style
import { makeStyles } from '@mui/styles';
import './App.css'
// Slice
import {
  setCurrentServer,
  selectCurrentServerId
} from './slices/app';
// App component
import InputBar from './components/InputBar';
import MessageList from './components/chat/MessageList';

import { ServerAttributes } from '@shared/models/server';
import { WebSocketProvider } from './context/WebSocketContext';

import UserManager from './components/data/UserManager';

import OnlineUsersComponent from './components/OnlineUsersComponent';

const useStyles = makeStyles({
  appContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  messageContainer: {
    flexGrow: 1,
    width: '100%',
    overflow: 'auto',
    backgroundColor: 'background.default',
  },
  messageInnerContainer: {
    padding: '8px',
    color: 'text.primary',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  selectServerPaper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    borderRadius: '4px',
    border: '1px solid',
    borderColor: 'grey.200',
    backgroundColor: 'background.paper',
    height: '64px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'grey.200',
    },
    width: '100%',
  },
  selectServerText: {
    color: 'text.primary',
  },
});

function App() {
  // Dispatch
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  // Selectors
  const messages = useSelector((state: RootState) => state.messages.messages);
  const messageStatus = useSelector((state: RootState) => state.messages.status);
  const user = useSelector((state: RootState) => state.user.user);
  const auth = useSelector((state: RootState) => state.auth);

  const currentServerId = useSelector(selectCurrentServerId);

  // Refs
  const inputMessageRef = useRef<HTMLTextAreaElement>(null);
  // State

  useEffect(() => {
    dispatch(fetchPublicServers());
  }, [dispatch]);

  useEffect(() => {
    if (currentServerId !== null) {
      dispatch(fetchServerMessages(currentServerId));
      if (inputMessageRef.current) {
        inputMessageRef.current.focus();
      }
    }
  }, [currentServerId, dispatch]);

  const sendMessageHandler = (message: string) => {
    if (currentServerId) {
      dispatch(sendMessageToServer({ message, serverId: currentServerId }));
    }
  };

  return (
    <>
      {/* <ServerSideBar server={servers.find((server) => server.id === currentServerId)} user={user} /> */}
      <Box className={classes.mainContent}>
        <Box className={classes.messageContainer}>
          <Box className={classes.messageInnerContainer}>
            {!currentServerId && (
              <Paper className={classes.selectServerPaper}>
                <Typography className={classes.selectServerText}>
                  Select a server
                </Typography>
              </Paper>
            )}
            {currentServerId && (
              <MessageList
                messages={messages}
                isLoading={false} // TODO: (James) Add loading state that is aware of server changes, don't isLoading if only message loading
              />
            )}
          </Box>
        </Box>
        <InputBar
          onSubmit={sendMessageHandler}
          inputRef={inputMessageRef}
          disabled={!currentServerId}
        />
      </Box>
    </>
  );
}

export default App
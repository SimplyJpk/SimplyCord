import React from 'react';
import { RootState } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
// MUI
import { makeStyles } from '@mui/styles';
// MUI Components
import Box from '@mui/material/Box';
// Slice
import {
  setCurrentServer,
  selectCurrentServerId
} from '../../slices/app';
// 
import { ServerAttributes } from '@shared/models/server';
import { WebSocketProvider } from '../../context/WebSocketContext';
const { VITE_APP_WEBSOCKET_URL } = import.meta.env;
// App Components
import ServerList from '../../components/ServerList';

const useStyles = makeStyles({
  appContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
  },
});

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  // Selectors
  const auth = useSelector((state: RootState) => state.auth);

  // Handlers
  const onServerSelect = (server: ServerAttributes) => {
    dispatch(setCurrentServer(server.id));
  };

  return (
    <WebSocketProvider
      url={VITE_APP_WEBSOCKET_URL}
      token={auth.token}
    >
      <main>
        <Box className={classes.appContainer}>
          <ServerList onServerSelect={onServerSelect} />
          <Outlet />
        </Box>
      </main>
    </WebSocketProvider>
  );
};

export default MainLayout;
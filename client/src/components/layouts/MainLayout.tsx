import React from 'react';
import { useEffect } from 'react';
import { RootState } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// MUI
import { makeStyles } from '@mui/styles';
// MUI Components
import Box from '@mui/material/Box';
// Slice
import {
  setCurrentServer,
  selectCurrentServerId,
} from '../../slices/app';
import { fetchMe } from '../../slices/userSlice';
import {
  fetchServerMessages,
  fetchServerUsers,
  selectPublicServers,
} from '../../slices/serverSlice';
// 
import { ServerUsersAttributes } from '@shared/models/server';
import { WebSocketProvider } from '../../context/WebSocketContext';
const { VITE_APP_WEBSOCKET_URL } = import.meta.env;
// App Components
import ServerList from './ServerList/ServerList';
import ServerSideBar from './serverSideBar/ServerSideBar';
import UserSideBar from './serverSideBar/UserSideBar';

const useStyles = makeStyles({
  appContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
  },
  serverSideBarContainer: {
    display: 'flex',
  },
  userSideBarContainer: {
    display: 'flex',
  },
});

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();
  const location = useLocation();

  // Selectors
  const auth = useSelector((state: RootState) => state.auth);

  const servers = useSelector(selectPublicServers);
  const user = useSelector((state: RootState) => state.user.user);
  const currentServerId = useSelector(selectCurrentServerId);

  // Handlers
  const onServerSelect = (server: ServerUsersAttributes) => {
    navigate(`/servers/${server.serverId}`);
    dispatch(setCurrentServer(server.serverId));
  };

  // Effects
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (serverId) {
      dispatch(setCurrentServer(serverId));
      dispatch(fetchServerMessages(serverId));
      dispatch(fetchServerUsers(serverId));
    }
  }, [serverId, dispatch]);

  useEffect(() => {
    if (location.pathname === '/explore') {
      dispatch(setCurrentServer(null));
    }
  }, [location]);

  useEffect(() => {
    if (channelId) {
      // TODO: (James) Navigate to channel
    }
  }, [channelId]);

  return (
    <WebSocketProvider
      url={VITE_APP_WEBSOCKET_URL}
      token={auth.token}
    >
      <main>
        <Box className={classes.appContainer}>
          <Box className={classes.serverSideBarContainer}>
            <ServerList onServerSelect={onServerSelect} />
            <ServerSideBar server={servers.find((server) => server.id == currentServerId)} user={user} />
          </Box>
          <Outlet />
          <Box className={classes.userSideBarContainer}>
            <UserSideBar />
          </Box>
        </Box>
      </main>
    </WebSocketProvider>
  );
};

export default MainLayout;
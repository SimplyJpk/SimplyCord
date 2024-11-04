import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
// Slices
import {
  selectServerPicture,
  fetchServerPicture,
  selectServerBanner,
  fetchServerBanner,
} from '../../../slices/serverSlice';
import {
  selectUserServers,
} from '../../../slices/userSlice';
// MUI
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// MUI Icons
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
// Resources
import DefaultAvatar from './../../../assets/icons/profile.png';

import ServerPicture from './ServerPicture';
import { ServerAttributes } from '@shared/models/server';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    maxWidth: 1300,
    margin: '0 auto',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
    // borderRadius top at top
    borderTopLeftRadius: theme.spacing(5),
    borderTopRightRadius: theme.spacing(5),
    borderBottomLeftRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9 aspect ratio
  },
  cardContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
    marginBottom: 'auto',
    display: 'flex',
  },
  serverInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  memberCount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
}));

const ServerCard = ({
  server,
  onJoinServer,
}: {
  server: ServerAttributes,
  onJoinServer?: (serverId: number) => void,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  const serverPicture = useSelector(state => selectServerPicture(state, server.id));
  const serverBanner = useSelector(state => selectServerBanner(state, server.id));
  const userServers = useSelector(selectUserServers);

  useEffect(() => {
    if (!serverPicture && server.id) {
      dispatch(fetchServerPicture(server.id));
    } else if (!serverBanner && server.id) {
      dispatch(fetchServerBanner(server.id));
    }
  }, [server.id, serverPicture]);

  return (
    <Card
      className={classes.card}
      onClick={() => onJoinServer && onJoinServer(server.id)}
      sx={{
        width: '300px',
      }}
    >
      <CardMedia
        className={classes.cardMedia}
        image={serverBanner || DefaultAvatar}
        title={`${server.name} banner`}
      />
      <CardContent className={classes.cardContent}>
        <Box className={classes.serverInfo}>
          <Box className={classes.avatar}>
            <ServerPicture
              serverId={server.id}
            />
          </Box>
          <Box>
            <Typography variant="h6" component="h2">
              {server.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {server.description}
            </Typography>
          </Box>
        </Box>
        <Box className={classes.memberCount}>
          <Typography variant="body2" color="textSecondary" ml={2}>
            {server.memberCount ? ` ${server.memberCount} members` : 'No members'}
          </Typography>
          {onJoinServer && (
            <IconButton
              color="primary"
              aria-label="join-server"
              onClick={() => onJoinServer && onJoinServer(server.id)}
            >
              {userServers.find((userServer) => userServer.serverId === server.id) ?
                <LogoutIcon /> : <LoginIcon />
              }
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  )
};

export default ServerCard;
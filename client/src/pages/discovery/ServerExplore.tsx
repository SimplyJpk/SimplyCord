import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// MUI
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// MUI Components
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
// MUI Icons
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
// Slices
import { selectPublicServers, fetchPublicServers, joinServer } from '../../slices/serverSlice';
import { selectUserServers } from '../../slices/userSlice';
// Resources
import DefaultAvatar from '../../assets/icons/profile.png';
import { isEqual } from 'lodash';

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
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
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

const ServerExplore = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const servers = useSelector(selectPublicServers);
  const userServers = useSelector(selectUserServers);

  // Handlers
  const handleJoinServer = (serverId) => {
    dispatch(joinServer(serverId));
  };

  // Effects
  useEffect(() => {
    dispatch(fetchPublicServers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPublicServers());
  }, [userServers]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {servers.map((server) => (
          <Grid
            sx={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
            key={server.id}
          >
            <Card
              className={classes.card}
              onClick={() => handleJoinServer(server.id)}
              sx={{
                width: '300px',
              }}
            >
              <CardMedia
                className={classes.cardMedia}
                image={server.bannerUrl || DefaultAvatar}
                title={`${server.name} banner`}
              />
              <CardContent className={classes.cardContent}>
                <Box className={classes.serverInfo}>
                  <Avatar
                    src={server.avatarUrl || DefaultAvatar}
                    alt={`${server.name} avatar`}
                    className={classes.avatar}
                  />
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
                  <IconButton
                    color="primary"
                    aria-label="join-server"
                    onClick={() => handleJoinServer(server.id)}
                  >
                    {userServers.find((userServer) => userServer.serverId === server.id) ?
                      <LogoutIcon /> : <LoginIcon />
                    }
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ServerExplore;
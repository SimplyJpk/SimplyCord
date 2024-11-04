import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// MUI
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// MUI Components
import Grid from '@mui/material/Grid2';
// Slices
import { selectPublicServers, fetchPublicServers, joinServer } from '../../slices/serverSlice';
import { selectUserServers } from '../../slices/userSlice';
// Resources
import ServerCard from '../../components/layouts/ServerList/ServerCard';

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
            <ServerCard
              server={server}
              onJoinServer={handleJoinServer}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ServerExplore;
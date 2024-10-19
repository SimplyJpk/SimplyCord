import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ServerAttributes } from '@shared/models/server';
import { ServerChannelAttributes } from '@shared/models/serverChannel';

import { UserAttributes } from '@shared/models/user';

import { AppDispatch } from '../../../store/store';
// MUI 
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// Components
import UserPrimary from '../../user/UserPrimary';

const useStyles = makeStyles((theme: Theme) => ({
  sidebar: {
    height: '100vh',
    backgroundColor: theme.palette.grey[800],
    color: 'white',
    position: 'relative',
    borderRight: `1px solid ${theme.palette.grey[700]}`,
    overflow: 'hidden',
    transition: 'width 0.5s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '3rem',
    width: '100%',
    cursor: 'pointer',
    '&:hover': { backgroundColor: theme.palette.grey[900] },
  },
  headerText: {
    color: 'white',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  divider: {
    backgroundColor: theme.palette.grey[500],
    opacity: 0.5,
  },
  channelList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  channelItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    height: '3rem',
    width: '100%',
    cursor: 'pointer',
    '&:hover': { backgroundColor: theme.palette.grey[900] },
    padding: theme.spacing(2),
  },
  footer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
  },
}));

export default function ServerSideBar({
  server,
  user,
}: {
  server: ServerAttributes;
  user: UserAttributes;
}) {
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  // State
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handlers

  // Effects
  useEffect(() => {
    if (!server || server.channels?.length === 0) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  }, [server]);

  return (
    <Box
      className={classes.sidebar}
      sx={{
        width: drawerOpen ? '20rem' : '0',
      }}
    >
      <Box className={classes.header}>
        <Typography className={classes.headerText}>{server?.name}</Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box
        className={classes.channelList}
      >
        <Box className={classes.header}>
          <Typography className={classes.headerText}>Channels</Typography>
        </Box>
        <Box className={classes.channelList}>
          {server?.channels?.map((channel: ServerChannelAttributes, index) => (
            <Box key={index} className={classes.channelItem}>
              <Typography className={classes.headerText}>{channel.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className={classes.footer}>
        <UserPrimary user={user} />
      </Box>
    </Box>
  );
}
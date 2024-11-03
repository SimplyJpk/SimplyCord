import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { UserAttributes } from '@shared/models/user';
// MUI
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Resources
import { AppDispatch } from '../../store/store';
import ProfilePicture from './ProfilePicture';

// TODO: (James) Virtualize this component so it won't lag when there are a lot of users

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 48,
    display: 'flex',
    flexGrow: 1,
    fontSize: '0.875rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5),
  },
  avatar: {
    width: 32,
    height: 32,
    cursor: 'pointer',
    transition: 'all 0.5s',
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
    borderRadius: '50%',
  },
  username: {
    color: 'white',
  },
  status: {
    fontSize: '0.75rem',
    marginLeft: 'auto',
  },
}));

export default function UserSecondary({
  user,
}: {
  user: UserAttributes,
}) {
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <ProfilePicture
        userId={user?.id}
        isOnline={user?.isOnline}
        showOnlineStatus={true}
      />
      <Box className={classes.container}>
        <Typography
          className={classes.username}
        >
          {user?.username}
        </Typography>
        <Typography
          className={classes.status}
          color={user?.isOnline ? 'success' : 'error'}
        >
          {user?.isOnline ? 'Online' : 'Offline'}
        </Typography>
      </Box>
    </Box>
  );
}
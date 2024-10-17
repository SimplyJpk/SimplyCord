import React from 'react';
import { UserAttributes } from '@shared/models/user';
// MUI
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
// MUI Components
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// Resources
import DefaultAvatar from '../../assets/icons/profile.png';

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
    boxShadow: theme.shadows[1],
    transition: 'all 0.5s',
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
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
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Avatar
        src={DefaultAvatar}
        alt="user-avatar"
        className={classes.avatar}
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
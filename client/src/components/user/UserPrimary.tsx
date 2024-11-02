import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import DefaultAvatar from './../../assets/icons/profile.png';
import { UserAttributes } from '@shared/models/user';
import { logout } from '../../slices/authSlice';
import { AppDispatch } from '../../store/store';
// MUI
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: 48,
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.palette.grey[900],
    fontSize: '0.875rem',
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
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  username: {
    color: 'white',
  },
  status: {
    fontSize: '0.75rem',
  },
  settingsButton: {
    marginLeft: 'auto',
    color: 'white',
    transition: 'all 0.5s',
    '&:hover': {
      transform: 'rotate(90deg) scale(1.25)',
    },
  },
}));

export default function UserPrimary({
  user,
}: {
  user: UserAttributes;
}) {
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (user?.userProfilePicture) {
      fetchUserProfilePicture(user.userProfilePicture.id);
    }
  }, [user]);

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <img
          id="profile-picture"
          src={DefaultAvatar}
          alt="user-avatar"
          className={classes.avatar}
        />
        <Box className={classes.userInfo}>
          <Typography className={classes.username}>{user?.username}</Typography>
          <Typography
            className={classes.status}
            color={user ? 'success' : 'error'}
          >
            {user ? 'Online' : 'Offline'}
          </Typography>
        </Box>
        <IconButton
          className={classes.settingsButton}
          onClick={() => dispatch(logout())}
        >
          <SettingsIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

async function fetchUserProfilePicture(userId) {
  try {
    const response = await fetch(`/api/profile-picture/${userId}`);
    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      document.getElementById('profile-picture').src = imageUrl;
    } else {
      console.error('Failed to fetch profile picture:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching profile picture:', error);
  }
}
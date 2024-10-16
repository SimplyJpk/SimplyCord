import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DefaultAvatar from './../../assets/icons/profile.png';
import { UserAttributes } from '@shared/models/user';
import { logout } from '../../slices/authSlice';
import { AppDispatch } from '../../store/store';

export default function UserPrimary({
  user,
}: {
  user: UserAttributes;
}) {
  const dispatch: AppDispatch = useDispatch();

  return (
    <Box sx={{ height: 48, display: 'flex', flexGrow: 1, bgcolor: 'grey.900', fontSize: '0.875rem' }}>
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', gap: 2, p: 1.5 }}>
        <Avatar
          src={DefaultAvatar}
          alt="user-avatar"
          sx={{
            width: 32,
            height: 32,
            cursor: 'pointer',
            boxShadow: 1,
            transition: 'all 0.5s',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ color: 'white' }}>{user?.username}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: user ? 'green.500' : 'red.500' }}>
            {user ? 'Online' : 'Offline'}
          </Typography>
        </Box>
        <IconButton
          sx={{
            marginLeft: 'auto',
            color: 'white',
            transition: 'all 0.5s',
            '&:hover': {
              transform: 'rotate(90deg) scale(1.25)',
            },
          }}
          onClick={() => dispatch(logout())}
        >
          <SettingsIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
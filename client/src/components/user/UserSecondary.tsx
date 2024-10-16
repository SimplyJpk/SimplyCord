import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { UserAttributes } from '@shared/models/user';
import DefaultAvatar from '../../assets/icons/profile.png';

export default function UserSecondary({ user }: { user: UserAttributes }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'gray.900',
        },
        overflow: 'hidden',
      }}
    >
      <Avatar
        src={DefaultAvatar}
        alt="user-avatar"
        sx={{
          width: 24,
          height: 24,
          '&:hover': {
            cursor: 'pointer',
            boxShadow: 3,
          },
          transition: 'all 0.5s',
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          sx={{
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            },
            fontSize: '0.875rem',
          }}
        >
          {user?.username}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: user ? 'green.500' : 'red.500',
          }}
        >
          {user ? 'Online?' : 'Offline?'}
        </Typography>
      </Box>
    </Box>
  );
}
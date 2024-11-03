import React from 'react';
// MUI Components
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MessageAttributes } from '@shared/models/message';
// Utils
import { getMessageDate } from '../../util/dateUtil';
// Resources
import DefaultAvatar from '../../assets/icons/profile.png';
import ProfilePicture from '../../components/user/ProfilePicture';

export function Message({ message }: { message: MessageAttributes }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'white',
        px: 2,
        py: 1,
      }}
    >
      <ProfilePicture
        userId={message.user?.id}
      />
      <Box
        sx={{
          ml: 2,
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: 'grey.900',
              fontWeight: 'bold',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {message.user?.username ?? message.userId}
          </Typography>
          <Typography sx={{ color: 'grey.500' }}>
            {message.createdAt ? getMessageDate(message.createdAt) : ''}
          </Typography>
        </Box>
        <Typography sx={{ color: 'grey.900', whiteSpace: 'pre-line' }}>
          {message.message}
        </Typography>
      </Box>
    </Box>
  );
}

export default React.memo(Message);
import { Avatar, Box, Typography } from '@mui/material';
import { MessageAttributes } from '@shared/models/message';
// Utils
import { getMessageDate } from '../../util/dateUtil';
// Resources
import DefaultAvatar from '../../assets/icons/profile.png';

export default function Message({ message }: { message: MessageAttributes }) {
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
      <Avatar
        src={message.user?.avatar ?? DefaultAvatar}
        alt="avatar"
        sx={{ width: 40, height: 40 }}
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
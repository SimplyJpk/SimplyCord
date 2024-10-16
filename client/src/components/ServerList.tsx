import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
// Models
import { ServerAttributes } from '@shared/models/server';
// Resources
import DefaultAvatar from '../assets/icons/profile.png';
import PlusCircle from '../assets/icons/ui/iconmonstr-plus-circle-lined-240.png';

export default function ServerList({
  onServerSelect,
}) {
  const servers = useSelector((state: RootState) => state.servers.servers);

  return (
    <Box
      sx={{
        width: '5rem',
        height: '100vh',
        backgroundColor: 'gray.900',
        color: 'white',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0.5rem',
          gap: '0.5rem',
          overflowY: 'auto',
          justifyContent: 'flex-end',
        }}
      >
        {servers.map((server: ServerAttributes, index) => (
          <Box
            key={index}
            onClick={() => onServerSelect(servers[index])}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid',
              backgroundColor: 'white',
              fontSize: '0.875rem',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'gray.200',
              },
              position: 'relative',
            }}
          >
            <Avatar
              src={server.icon || DefaultAvatar}
              alt="avatar"
              sx={{ width: '3.5rem', height: '3.5rem' }}
            />
            <Typography
              sx={{
                color: 'black',
                position: 'absolute',
              }}
            >
              {server.name}
            </Typography>
          </Box>
        ))}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.375rem',
            border: '1px solid',
            fontSize: '0.875rem',
            height: '4rem',
            width: '4rem',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'gray.200',
            },
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
          }}
        >
          <Avatar
            src={PlusCircle}
            alt="plus-circle"
            sx={{
              width: '3.5rem',
              height: '3.5rem',
              backgroundColor: 'gray.50',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'gray.600',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
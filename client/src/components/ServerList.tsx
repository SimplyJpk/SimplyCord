import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate, useParams } from 'react-router-dom';
// MUI
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
// Slice
import { selectUserServers } from '../slices/userSlice';
// Models
import { ServerUsersAttributes } from '@shared/models/server';
// Resources
import DefaultAvatar from '../assets/icons/profile.png';
import PlusCircle from '../assets/icons/ui/iconmonstr-plus-circle-lined-240.png';

const useStyles = makeStyles((theme: Theme) => ({
  serverListContainer: {
    minWidth: '4.5rem',
    height: '100vh',
    backgroundColor: 'gray.900',
    color: 'white',
    position: 'relative',
    borderRight: `1px solid ${theme.palette.grey[700]}`,
    overflow: 'hidden',
    transition: 'width 0.5s',
  },
  serverList: {
    display: 'flex',
    paddingTop: theme.spacing(1),
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
  },
  serverItem: {
    margin: 'auto',
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
    overflow: 'hidden',
  },
  avatar: {
    width: '3.5rem',
    height: '3.5rem',
    backgroundColor: 'gray.50',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'gray.600',
    },
  },
  exploreButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.875rem',
    height: '3.5rem',
    width: '3.5rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.grey[800],
    },
    position: 'absolute',
    bottom: '0.5rem',
    // TODO: (James) Better way to center this absolute element
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

export default function ServerList({
  onServerSelect,
}) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();

  // Selectors
  const servers = useSelector(selectUserServers);

  return (
    <Box className={classes.serverListContainer}>
      <Box className={classes.serverList}>
        {servers.map((server: ServerUsersAttributes, index) => (
          <Box
            key={index}
            onClick={() => onServerSelect(servers[index])}
            className={classes.serverItem}
          >
            <Avatar
              src={server.server?.iconUrl || DefaultAvatar}
              alt="avatar"
              className={classes.avatar}
            />
            <Typography
              sx={{
                color: 'black',
                position: 'absolute',
              }}
            >
              {server.server?.name}
            </Typography>
          </Box>
        ))}
        <Box
          className={classes.exploreButton}
          onClick={() => {
            // navigate to explore page
            navigate('/explore');
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
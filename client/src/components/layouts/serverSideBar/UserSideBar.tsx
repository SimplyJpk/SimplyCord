import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';
import { UserAttributes } from '@shared/models/user';
// Slices
import { selectCurrentServerId } from '../../../slices/app';
import { fetchServerUsers, selectSelectedServersUserList } from '../../../slices/serverSlice';
import { AppDispatch } from '../../../store/store';
// Components
import UserSecondary from '../../user/UserSecondary';
// MUI
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
// Hooks
import { useWebSocket } from '../../../hooks/useWebSocket';

const useStyles = makeStyles((theme: Theme) => ({
  sidebar: {
    width: '20rem',
    height: '100vh',
    backgroundColor: theme.palette.grey[800],
    color: 'white',
    position: 'relative',
    borderRight: `1px solid ${theme.palette.grey[700]}`,
    overflow: 'hidden',
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
    marginBottom: theme.spacing(1),
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default function UserSideBar() {
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  // Providers
  const { onlineUsers } = useWebSocket();

  // Selectors
  const currentServerId = useSelector(selectCurrentServerId);
  const selectedServersUserList = useSelector(selectSelectedServersUserList);

  // Effects
  useEffect(() => {
    if (currentServerId && selectedServersUserList.length === 0) {
      dispatch(fetchServerUsers(currentServerId));
    }
  }, [currentServerId, dispatch]);

  // Callback (when onlineUsers or currentServerId changes)
  const getCurrentUserList = useCallback(() => {
    const currentUserList = selectedServersUserList.map((user) => {
      const isOnline = onlineUsers.includes(user.id);
      return { ...user, isOnline };
    });
    return currentUserList;
  }, [selectedServersUserList, onlineUsers]);

  return (
    <Box className={classes.sidebar}>
      <Box className={classes.header}>
        <Typography variant="h6" className={classes.headerText}>
          Users
        </Typography>
      </Box>
      <Divider className={classes.divider} />
      <Box className={classes.userList}>
        {getCurrentUserList().map((user: UserAttributes, index) => (
          <UserSecondary key={index} user={user} />
        ))}
      </Box>
    </Box>
  );
}
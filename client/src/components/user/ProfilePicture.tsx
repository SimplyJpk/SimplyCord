import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
// Slices
import { selectUserProfilePicture } from '../../slices/userSlice';
import { fetchUserProfilePicture } from '../../slices/userSlice';
// MUI
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
// MUI Components
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
// Resources
import DefaultAvatar from './../../assets/icons/profile.png';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    cursor: 'pointer',
    transition: 'all 0.5s',
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#ff000000',
    color: '#ff000000',
    width: 8,
    height: 8,
    boxShadow: `0 0 0 2.5px ${theme.palette.background.paper}`,
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1.8)',
      opacity: 0,
    },
  },
}));

const ProfilePicture = ({
  userId,
  isOnline = false,
}: {
  userId: number,
  isOnline?: boolean,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  const profilePicture = useSelector(state => selectUserProfilePicture(state, userId));

  useEffect(() => {
    if (!profilePicture && userId) {
      dispatch(fetchUserProfilePicture(userId));
    }
  }, [userId, profilePicture]);

  return (
    <Stack direction="row" spacing={2}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            // TODO: (James) Make a theme variable for online/offline color
            backgroundColor: isOnline ? '#44b700' : '#ff0000',
            color: isOnline ? '#44b700' : '#ff0000',
          },
        }}
      >
        <Avatar
          id={`profile-picture-${userId}`}
          src={profilePicture || DefaultAvatar}
          alt="user-avatar"
          className={classes.avatar}
        />
      </StyledBadge>
    </Stack>
  )
};

export default ProfilePicture;
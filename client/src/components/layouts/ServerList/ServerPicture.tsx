import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
// Slices
import {
  selectServerPicture,
  fetchServerPicture,
  selectServerBanner,
  fetchServerBanner,
} from '../../../slices/serverSlice';
// MUI
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
// MUI Components
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
// Resources
import DefaultAvatar from './../../../assets/icons/profile.png';

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: '100%',
    height: 'auto',
    aspectRatio: '1 / 1', // Ensures the avatar is always square
    backgroundColor: 'gray.50',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'gray.600',
    },
  },
}));

const ServerPicture = ({
  serverId,
  isBanner = false,
}: {
  serverId: number,
  isBanner?: boolean,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const classes = useStyles();

  const serverPicture = useSelector(state => selectServerPicture(state, serverId));
  const serverBanner = useSelector(state => selectServerBanner(state, serverId));

  useEffect(() => {
    if (!isBanner && !serverPicture && serverId) {
      dispatch(fetchServerPicture(serverId));
    } else if (isBanner && !serverBanner && serverId) {
      dispatch(fetchServerBanner(serverId));
    }
  }, [serverId, serverPicture]);

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        id={`server-picture-${serverId}`}
        src={serverPicture || DefaultAvatar}
        alt="server-avatar"
        className={classes.avatar}
      />
    </Stack>
  )
};

export default ServerPicture;
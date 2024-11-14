import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
// Slices
import {
  getServerByID
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

  const server = useSelector(state => getServerByID(state, serverId));


  const getPicture = useCallback(() => {
    if (server) {
      const prefix = `${import.meta.env.VITE_APP_DOMAIN_URL}/static/server/${server.id}/`;
      if (isBanner && server.bannerUrl) {
        return `${prefix}${server.bannerUrl}`;
      } else if (!isBanner && server.iconUrl) {
        return `${prefix}${server.iconUrl}`;
      }
    }
    return DefaultAvatar;
  }, [isBanner, server]);

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        id={`server-picture-${serverId}`}
        srcSet={getPicture()}
        alt="server-avatar"
        className={classes.avatar}

      />
    </Stack>
  )
};

export default ServerPicture;
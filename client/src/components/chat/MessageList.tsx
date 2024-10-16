import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { MessageAttributes } from '@shared/models/message';
import { RootState } from '../../store/store';

import Message from './Message';
import {
  selectCurrentServerId,
  selectCurrentServerChannelId
} from '../../slices/app';

// MUI
import { makeStyles } from '@mui/styles';
// MUI Components
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles({
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    overflowY: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    height: '100%',
    width: '100%',
  },
});

export default function MessageList({
  messages,
  isLoading,
}: {
  messages: MessageAttributes[];
  isLoading: boolean;
}) {
  const classes = useStyles();

  // Refs
  const messageListRef = useRef<HTMLDivElement>(null);

  // Selectors
  const currentServerId = useSelector(selectCurrentServerId);
  const currentServerChannelId = useSelector(selectCurrentServerChannelId);

  // State
  const [isChangingChannel, setIsChangingChannel] = useState(false);

  // When message list changes, we check if we're near the bottom and scroll if we all
  useEffect(() => {
    if (messageListRef.current) {
      // get the last item in messageListRef
      const lastMessage = messageListRef.current.lastElementChild;
      if (!isChangingChannel && lastMessage) {
        // If we're near the bottom, scroll into view
        const isLastMessageInView = (lastMessage.getBoundingClientRect().bottom - 100) <= window.innerHeight;
        if (isLastMessageInView) {
          lastMessage.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setIsChangingChannel(false);
        lastMessage?.scrollIntoView({ behavior: 'instant' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // We wait for new messages from new server/channel before scrolling
  useEffect(() => {
    setIsChangingChannel(true);
  }, [currentServerId, currentServerChannelId]);

  return (
    <Box
      className={classes.messageList}
      ref={messageListRef}
    >
      {isLoading && (
        <Box className={classes.loadingContainer}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && messages.map((message: MessageAttributes, index) => (
        <Message key={index} message={message} />
      ))}
    </Box>
  );
}
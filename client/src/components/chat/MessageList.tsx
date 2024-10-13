import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { MessageAttributes } from '@shared/models/message';
import { RootState } from '../../store/store';

import Message from './Message';

import {
  selectCurrentServerId,
  selectCurrentServerChannelId
} from '../../slices/app';

export default function MessageList({
  messages,
  isLoading,
}: {
  messages: MessageAttributes[];
  isLoading: boolean;
}) {
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
    <div className="flex flex-col gap-1.5 overflow-y-auto" ref={messageListRef}>
      {isLoading && <div className="flex items-center justify-center gap-2 h-full w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500" />
      </div>}
      {!isLoading && messages.map((message: MessageAttributes, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
}
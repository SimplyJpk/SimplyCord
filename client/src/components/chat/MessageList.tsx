import { useEffect, useRef } from 'react';
import { MessageAttributes } from '@shared/models/message';

import Message from './Message';

export default function MessageList({
  messages,
  isLoading,
}: {
  messages: MessageAttributes[];
  isLoading: boolean;
}) {
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      const lastMessage = messageList.lastElementChild;
      if (lastMessage) {
        // If we're near the bottom, scroll into view
        const isLastMessageInView = (lastMessage.getBoundingClientRect().bottom - 100) <= window.innerHeight;
        if (isLastMessageInView) {
          lastMessage.scrollIntoView();
        }
      }
    }
  }, [messages]);

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
import { useEffect, useRef } from 'react';
import { MessageAttributes } from '@shared/models/message';

import Message from '../../components/Message';

export default function MessageList({
  messages,
}: {
  messages: MessageAttributes[];
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
      {messages.map((message: MessageAttributes, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
}
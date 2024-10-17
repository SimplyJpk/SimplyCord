import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const OnlineUsersComponent: React.FC = () => {
  const { onlineUsers } = useWebSocket();

  return (
    <div>
      <h2>Online Users</h2>
      <ul>
        {onlineUsers.map(userId => (
          <li key={userId}>{userId}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsersComponent;
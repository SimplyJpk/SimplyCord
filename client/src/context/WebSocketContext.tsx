import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import WebSocketClient from '../network/webSocket';

interface WebSocketProviderProps {
  url: string;
  token: string;
  children: React.ReactNode;
}

interface WebSocketContextValue {
  wsClient: WebSocketClient | null;
  subscribe: (event: string, callback: (data: any) => void) => void;
  unsubscribe: (event: string) => void;
  onlineUsers: string[];
}

export const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, token, children }) => {
  const wsClient = useRef<WebSocketClient | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!url || !token) {
      return;
    }

    if (!wsClient.current) {
      wsClient.current = new WebSocketClient(url, token);
    }

    wsClient.current.connect();

    const handleOnlineUsers = (data: { userIds: string[] }) => {
      setOnlineUsers(data.userIds);
    };

    wsClient.current.on('message', (message) => {
      if (message.type === 'onlineStatus') {
        handleOnlineUsers(message.data);
      }
    });

    return () => {
      if (wsClient.current) {
        wsClient.current.disconnect();
        wsClient.current = null;
      }
    };
  }, [url, token]);

  const subscribe = (event: string, callback: (data: any) => void) => {
    wsClient.current?.on(event, callback);
  };

  const unsubscribe = (event: string) => {
    wsClient.current?.off(event);
  };

  return (
    <WebSocketContext.Provider value={{ wsClient: wsClient.current, subscribe, unsubscribe, onlineUsers }}>
      {children}
    </WebSocketContext.Provider>
  );
};
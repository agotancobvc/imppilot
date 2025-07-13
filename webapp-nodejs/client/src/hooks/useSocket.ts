import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:8000');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('authenticate', { token });
    });

    newSocket.on('authenticated', (data: { success: boolean; user?: any }) => {
      if (data.success) {
        setSocket(newSocket);
        console.log('Authentication successful');
      } else {
        console.error('Authentication failed');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};

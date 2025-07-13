import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:8000');
    
    newSocket.on('connect', () => {
      newSocket.emit('authenticate', { token });
    });

    newSocket.on('authenticated', (data) => {
      if (data.success) {
        setSocket(newSocket);
      } else {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};

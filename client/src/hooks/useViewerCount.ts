import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useViewerCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_SERVER_URL as string}/viewer`);
    socket.on('viewerCount', (c: number) => setCount(c));
    return () => { socket.disconnect(); };
  }, []);

  return count;
}

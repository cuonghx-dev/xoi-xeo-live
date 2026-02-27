import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: number;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export function useChat(token: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_SERVER_URL as string, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('history', (msgs: ChatMessage[]) => setMessages(msgs));
    socket.on('message', (msg: ChatMessage) =>
      setMessages((prev) => [...prev, msg]),
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token]);

  const sendMessage = (content: string) => {
    socketRef.current?.emit('message', content);
  };

  return { messages, connected, sendMessage };
}

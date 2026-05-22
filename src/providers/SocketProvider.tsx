'use client';

import { useEffect } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket/client';
import { useGameStore } from '@/store';

// Manages the single socket connection for the entire app.
// Lives at the root layout so the connection persists across route changes.
// Child components subscribe to events via useSocketEvent() — they never
// touch the socket instance directly.
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const setConnectionStatus = useGameStore((s) => s.setConnectionStatus);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => setConnectionStatus('connected');
    const onDisconnect = () => setConnectionStatus('disconnected');
    const onConnectError = () => setConnectionStatus('error');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    setConnectionStatus('connecting');
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      disconnectSocket();
    };
  }, [setConnectionStatus]);

  return <>{children}</>;
}

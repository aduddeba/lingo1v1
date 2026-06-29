'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSocket, disconnectSocket } from '@/lib/socket/client';
import { useGameStore } from '@/store';

const SOCKET_ROUTES = ['/lobby', '/match'];

function needsSocket(pathname: string): boolean {
  return SOCKET_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const setConnectionStatus = useGameStore((s) => s.setConnectionStatus);
  const pathname = usePathname();

  useEffect(() => {
    if (!needsSocket(pathname)) {
      setConnectionStatus('disconnected');
      return;
    }

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
  }, [setConnectionStatus, pathname]);

  return <>{children}</>;
}

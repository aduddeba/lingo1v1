import { io, type Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export function getSocket(): AppSocket {
  if (typeof window === 'undefined') {
    throw new Error('getSocket() must only be called on the client side.');
  }

  if (!socket) {
    const socketUrl =
      process.env['NEXT_PUBLIC_SOCKET_URL'] ??
      `${window.location.protocol}//${window.location.hostname}:3001`;

    socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
      timeout: 20_000,
      withCredentials: true,
    });
  }

  return socket;
}

export async function prepareSocketAuth(isAuthenticated: boolean): Promise<void> {
  const activeSocket = getSocket();
  if (!isAuthenticated) {
    activeSocket.auth = {};
    return;
  }

  const response = await fetch('/api/auth/socket-token', {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) {
    activeSocket.auth = {};
    return;
  }

  const data = (await response.json().catch(() => ({}))) as { token?: unknown };
  activeSocket.auth = typeof data.token === 'string' ? { token: data.token } : {};
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

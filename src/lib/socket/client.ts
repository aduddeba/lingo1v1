import { io, type Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Module-level singleton — one socket per browser tab, shared across all hooks.
// Stored outside React state so it survives re-renders and StrictMode double-mounts.
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

// Called on sign-out or unmount of the root socket provider.
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

import type { Server, Socket, DefaultEventsMap } from 'socket.io';
import type {
  AuthenticatedSocketUser,
  ClientToServerEvents,
  ServerToClientEvents,
  Player,
} from '@/types';

export interface SocketData {
  player?: Player;
  authenticatedUser?: AuthenticatedSocketUser;
  queuedRanked?: boolean;
  lobbyId?: string;
}

export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;
export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;

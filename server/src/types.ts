import type { Server, Socket, DefaultEventsMap } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, Player, Difficulty } from '@/types';

export interface SocketData {
  player?: Player;
  // Difficulty queue being solo-waited on, or, once paired, the lobby/match
  // room id (the two share an id — see matchmaking.ts).
  queueDifficulty?: Difficulty;
  lobbyId?: string;
}

export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;
export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>;

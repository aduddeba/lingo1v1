import type { Player } from '@/types';
import type { MatchSession } from './match';

export interface LobbyPlayer {
  socketId: string;
  player: Player;
  authenticatedUserId?: string;
}

export interface PendingLobby {
  players: [LobbyPlayer, LobbyPlayer];
  ready: Set<string>; // player ids
  countdownTimeout: ReturnType<typeof setTimeout> | null;
}

// One connected player per socket, keyed by socket id.
export const connectedPlayers = new Map<string, Player>();

// Single ranked queue. Question difficulty is selected at match start from
// authoritative Elo rather than from client-provided difficulty.
export const queues = new Map<'ranked', LobbyPlayer>();

// Two matched players readying up, keyed by a freshly generated lobby id
// (reused as the matchId once the match starts, since both sockets are
// already joined to that Socket.IO room).
export const pendingLobbies = new Map<string, PendingLobby>();

// matchId -> live session, and the reverse lookup so `answer:submit` /
// disconnect handlers can find a player's match without scanning every session.
export const matches = new Map<string, MatchSession>();
export const socketToMatch = new Map<string, string>();

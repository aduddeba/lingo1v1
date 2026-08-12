import type { Difficulty, Player } from '@/types';
import type { MatchSession } from './match';

export interface LobbyPlayer {
  socketId: string;
  player: Player;
}

export interface PendingLobby {
  difficulty: Difficulty;
  players: [LobbyPlayer, LobbyPlayer];
  ready: Set<string>; // player ids
  countdownTimeout: ReturnType<typeof setTimeout> | null;
}

// One connected player per socket, keyed by socket id.
export const connectedPlayers = new Map<string, Player>();

// difficulty -> the single player currently waiting for an opponent (Quick
// Match no longer splits by mode — matches mix questions from every mode, see
// server/src/questions.ts). A second joiner on the same difficulty pairs
// immediately and the entry is removed.
export const queues = new Map<Difficulty, LobbyPlayer>();

// Two matched players readying up, keyed by a freshly generated lobby id
// (reused as the matchId once the match starts, since both sockets are
// already joined to that Socket.IO room).
export const pendingLobbies = new Map<string, PendingLobby>();

// matchId -> live session, and the reverse lookup so `answer:submit` /
// disconnect handlers can find a player's match without scanning every session.
export const matches = new Map<string, MatchSession>();
export const socketToMatch = new Map<string, string>();

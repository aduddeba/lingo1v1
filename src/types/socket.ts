import type { Match, Round, PlayerScore, AnswerResult, Difficulty } from './game';
import type { Player } from './player';

// ─── Server → Client ─────────────────────────────────────────────────────────
// These are the events the Socket.IO server broadcasts to connected clients.
// Keeping them in a shared types file lets the future server package import
// this same definition — one source of truth for the wire protocol.

export interface ServerToClientEvents {
  'lobby:update': (payload: {
    players: Player[];
    readyCount: number;
    maxPlayers: number;
  }) => void;
  'lobby:player_joined': (payload: { player: Player }) => void;
  'lobby:player_left': (payload: { playerId: string }) => void;
  'lobby:countdown': (payload: { startsIn: number }) => void;

  'match:start': (payload: { match: Match }) => void;
  'match:state': (payload: { match: Match }) => void;
  'match:end': (payload: { match: Match; winnerId: string | null }) => void;

  'round:start': (payload: { round: Round }) => void;
  'round:end': (payload: {
    round: Round;
    scores: Record<string, PlayerScore>;
    correctAnswer: string;
  }) => void;
  'round:tick': (payload: { timeRemaining: number }) => void;

  'answer:result': (payload: AnswerResult) => void;

  'score:update': (payload: { scores: Record<string, PlayerScore> }) => void;

  error: (payload: { code: string; message: string }) => void;
}

// ─── Client → Server ─────────────────────────────────────────────────────────

export interface ClientToServerEvents {
  'lobby:join': (
    payload: {
      difficulty: Difficulty;
      player: { id: string; username: string };
    },
    callback: (err: string | null) => void
  ) => void;
  'lobby:leave': () => void;
  'lobby:ready': (payload: { ready: boolean }) => void;

  'answer:submit': (payload: {
    matchId: string;
    roundId: string;
    answer: string;
  }) => void;
}

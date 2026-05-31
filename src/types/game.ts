// ─── Core Enumerations ───────────────────────────────────────────────────────

export type GamePhase =
  | 'waiting'
  | 'countdown'
  | 'active'
  | 'round_end'
  | 'game_over';

export type GameMode =
  | 'map_sniping'
  | 'forgery'
  | 'live_bidding'
  | 'language_powerups'
  | 'historical_evolution'
  | 'elo_specialty'
  | 'spectator_deduction'
  | 'script_blitz';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// ─── Domain Objects ───────────────────────────────────────────────────────────

export interface Round {
  id: string;
  number: number;
  prompt: string;
  timeLimit: number;
  startedAt: number | null;
  endsAt: number | null;
}

export interface PlayerScore {
  playerId: string;
  score: number;
  streak: number;
  answersCorrect: number;
  answersTotal: number;
}

export interface Match {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  phase: GamePhase;
  currentRound: Round | null;
  maxRounds: number;
  scores: Record<string, PlayerScore>;
  startedAt: number | null;
  finishedAt: number | null;
}

// ─── Action Payloads ─────────────────────────────────────────────────────────

export interface AnswerSubmission {
  matchId: string;
  roundId: string;
  answer: string;
  submittedAt: number;
}

export interface AnswerResult {
  correct: boolean;
  pointsDelta: number;
  newScore: number;
  newStreak: number;
  correctAnswer?: string;
}

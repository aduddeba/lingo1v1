// ─── Core Enumerations ───────────────────────────────────────────────────────

export type GamePhase =
  | 'waiting'
  | 'countdown'
  | 'active'
  | 'round_end'
  | 'game_over';

export type GameMode =
  | 'forgery'
  | 'historical_evolution'
  | 'script_blitz'
  | 'city_country';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'mixed';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// ─── Domain Objects ───────────────────────────────────────────────────────────

export interface Round {
  id: string;
  number: number;
  // Multiplayer mixes questions from every mode into one match (see
  // MatchmakingSetup - players only pick a difficulty), so mode is a
  // per-round property, not a per-match one.
  mode: GameMode;
  prompt: string;
  timeLimit: number;
  startedAt: number | null;
  endsAt: number | null;
  // Present only for choice-based modes (forgery, historical_evolution);
  // absent for text-input modes, which render a free-text answer field instead.
  options?: string[];
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
  difficulty: Difficulty;
  phase: GamePhase;
  currentRound: Round | null;
  maxRounds: number;
  scores: Record<string, PlayerScore>;
  startedAt: number | null;
  finishedAt: number | null;
}

export type RankedMatchResult = 'win' | 'loss' | 'draw';

export interface RatingResult {
  result: RankedMatchResult;
  previousRating: number;
  newRating: number;
  ratingChange: number;
}

// ─── Action Payloads ─────────────────────────────────────────────────────────

export interface AnswerSubmission {
  matchId: string;
  roundId: string;
  answer: string;
  pointsDelta?: number;
  submittedAt: number;
}

export interface AnswerResult {
  correct: boolean;
  specificityLevel?: 'incorrect' | 'broad' | 'specific' | 'preferred';
  specificityPoints?: 0 | 1 | 2 | 3;
  pointsDelta: number;
  newScore: number;
  newStreak: number;
  correctAnswer?: string;
}

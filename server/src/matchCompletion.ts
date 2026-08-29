import { MAX_ROUNDS_PER_MATCH, TARGET_SCORE_PER_MATCH } from '@/lib/constants/game';
import type { MatchCompletionReason, PlayerScore } from '@/types';
import type { LobbyPlayer } from './state';
import { determineWinnerFromScores } from './matchResults';

export interface MatchProgressInput {
  players: readonly [LobbyPlayer, LobbyPlayer];
  scores: Record<string, PlayerScore>;
  roundsPlayed: number;
  targetScore?: number;
  maxRounds?: number;
}

export interface MatchProgressResult {
  finished: boolean;
  reason: MatchCompletionReason | null;
  winnerId: string | null;
}

export type RoundAdvanceDecision = 'finish_match' | 'next_round';

export function evaluateMatchProgress(input: MatchProgressInput): MatchProgressResult {
  const targetScore = input.targetScore ?? TARGET_SCORE_PER_MATCH;
  const maxRounds = input.maxRounds ?? MAX_ROUNDS_PER_MATCH;
  const targetReached = input.players.some(
    ({ player }) => (input.scores[player.id]?.score ?? 0) >= targetScore
  );
  const roundLimitReached = input.roundsPlayed >= maxRounds;

  if (!targetReached && !roundLimitReached) {
    return {
      finished: false,
      reason: null,
      winnerId: null,
    };
  }

  const winnerId = determineWinnerFromScores(input.players, input.scores);

  return {
    finished: true,
    reason: winnerId ? (targetReached ? 'target_score' : 'round_limit') : 'draw',
    winnerId,
  };
}

export function getRoundAdvanceDecision(
  progress: MatchProgressResult,
  hasNextRound: boolean
): RoundAdvanceDecision {
  return progress.finished || !hasNextRound ? 'finish_match' : 'next_round';
}

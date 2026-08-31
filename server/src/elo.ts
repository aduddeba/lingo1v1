import { TARGET_SCORE_PER_MATCH } from '@/lib/constants/game';

export const ELO_K_FACTOR = 32;
export const ELO_MARGIN_TARGET_SCORE = TARGET_SCORE_PER_MATCH;
export const ELO_MIN_MARGIN_MULTIPLIER = 0.25;
export const ELO_MAX_MARGIN_MULTIPLIER = 1.5;

export interface EloPlayerResult {
  previousRating: number;
  newRating: number;
  ratingChange: number;
}

export interface EloMatchResult {
  playerA: EloPlayerResult;
  playerB: EloPlayerResult;
}

export function getExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
}

export function calculateEloRating(
  ratingA: number,
  ratingB: number,
  scoreA: 0 | 0.5 | 1,
  kFactor = ELO_K_FACTOR,
  marginMultiplier = 1
): number {
  return Math.round(
    ratingA + kFactor * marginMultiplier * (scoreA - getExpectedScore(ratingA, ratingB))
  );
}

export function getScoreMarginMultiplier(
  scoreDifference: number,
  targetScore = ELO_MARGIN_TARGET_SCORE
): number {
  if (scoreDifference <= 0 || targetScore <= 0) return ELO_MIN_MARGIN_MULTIPLIER;

  const scaledMargin = Math.sqrt(scoreDifference / targetScore);
  return Math.min(
    ELO_MAX_MARGIN_MULTIPLIER,
    Math.max(ELO_MIN_MARGIN_MULTIPLIER, scaledMargin)
  );
}

export function calculateEloMatchResult(
  ratingA: number,
  ratingB: number,
  scoreA: 0 | 0.5 | 1,
  kFactor = ELO_K_FACTOR,
  scoreDifference?: number,
  targetScore = ELO_MARGIN_TARGET_SCORE
): EloMatchResult {
  const scoreB = (1 - scoreA) as 0 | 0.5 | 1;
  const marginMultiplier =
    scoreDifference === undefined ? 1 : getScoreMarginMultiplier(scoreDifference, targetScore);
  const newRatingA = calculateEloRating(ratingA, ratingB, scoreA, kFactor, marginMultiplier);
  const newRatingB = calculateEloRating(ratingB, ratingA, scoreB, kFactor, marginMultiplier);

  return {
    playerA: {
      previousRating: ratingA,
      newRating: newRatingA,
      ratingChange: newRatingA - ratingA,
    },
    playerB: {
      previousRating: ratingB,
      newRating: newRatingB,
      ratingChange: newRatingB - ratingB,
    },
  };
}

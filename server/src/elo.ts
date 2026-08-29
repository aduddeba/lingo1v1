export const ELO_K_FACTOR = 32;

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
  kFactor = ELO_K_FACTOR
): number {
  return Math.round(ratingA + kFactor * (scoreA - getExpectedScore(ratingA, ratingB)));
}

export function calculateEloMatchResult(
  ratingA: number,
  ratingB: number,
  scoreA: 0 | 0.5 | 1,
  kFactor = ELO_K_FACTOR
): EloMatchResult {
  const scoreB = (1 - scoreA) as 0 | 0.5 | 1;
  const newRatingA = calculateEloRating(ratingA, ratingB, scoreA, kFactor);
  const newRatingB = calculateEloRating(ratingB, ratingA, scoreB, kFactor);

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

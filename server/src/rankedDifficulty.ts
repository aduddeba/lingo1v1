import { getPublicUserById } from '@/lib/auth/users';
import type { Difficulty } from '@/types';
import type { LobbyPlayer } from './state';

export type RankedQuestionDifficulty = Extract<Difficulty, 'easy' | 'medium' | 'hard'>;

export interface DifficultyWeight {
  difficulty: RankedQuestionDifficulty;
  weight: number;
}

export const GUEST_ELO_RATING = 1000;

export function getRankedQueueKey(_clientDifficulty?: Difficulty): 'ranked' {
  return 'ranked';
}

export function getQuestionDifficultyDistribution(eloRating: number): DifficultyWeight[] {
  if (eloRating < 900) {
    return [
      { difficulty: 'easy', weight: 75 },
      { difficulty: 'medium', weight: 20 },
      { difficulty: 'hard', weight: 5 },
    ];
  }

  if (eloRating < 1100) {
    return [
      { difficulty: 'easy', weight: 55 },
      { difficulty: 'medium', weight: 35 },
      { difficulty: 'hard', weight: 10 },
    ];
  }

  if (eloRating < 1300) {
    return [
      { difficulty: 'easy', weight: 35 },
      { difficulty: 'medium', weight: 45 },
      { difficulty: 'hard', weight: 20 },
    ];
  }

  if (eloRating < 1500) {
    return [
      { difficulty: 'easy', weight: 20 },
      { difficulty: 'medium', weight: 45 },
      { difficulty: 'hard', weight: 35 },
    ];
  }

  return [
    { difficulty: 'easy', weight: 10 },
    { difficulty: 'medium', weight: 30 },
    { difficulty: 'hard', weight: 60 },
  ];
}

export function selectDifficultyFromDistribution(
  distribution: readonly DifficultyWeight[],
  random = Math.random
): RankedQuestionDifficulty {
  const totalWeight = distribution.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return 'medium';

  let threshold = random() * totalWeight;
  for (const item of distribution) {
    threshold -= item.weight;
    if (threshold < 0) return item.difficulty;
  }

  return distribution[distribution.length - 1]?.difficulty ?? 'medium';
}

export async function resolveAuthoritativeMatchElo(
  players: readonly LobbyPlayer[],
  loadUserById: typeof getPublicUserById = getPublicUserById
): Promise<number> {
  const ratings = await Promise.all(
    players.map(async ({ authenticatedUserId, player }) => {
      if (!authenticatedUserId) return GUEST_ELO_RATING;

      const user = await loadUserById(authenticatedUserId).catch(() => null);
      return user?.eloRating ?? player.rating;
    })
  );

  return Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length);
}

export async function selectRankedQuestionDifficulty(
  players: readonly LobbyPlayer[],
  random = Math.random,
  loadUserById: typeof getPublicUserById = getPublicUserById
): Promise<RankedQuestionDifficulty> {
  const matchElo = await resolveAuthoritativeMatchElo(players, loadUserById);
  return selectDifficultyFromDistribution(getQuestionDifficultyDistribution(matchElo), random);
}

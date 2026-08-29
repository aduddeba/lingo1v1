import {
  getPublicUserById,
  getRatingHistoryForUser,
  getRecentRankedResultsForUser,
  type PublicRatingHistoryEntry,
  type PublicRankedMatchSummary,
} from '@/lib/auth/users';

export interface DashboardUserSummary {
  username: string;
  eloRating: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winPercentage: number;
}

export interface DashboardData {
  user: DashboardUserSummary;
  ratingHistory: PublicRatingHistoryEntry[];
  peakElo: number;
  recentEloChange: number;
  recentResults: PublicRankedMatchSummary[];
}

export type DashboardAccessResult =
  | { status: 200; dashboard: DashboardData }
  | { status: 403; error: string }
  | { status: 404; error: string };

export async function getDashboardDataForUser(
  authenticatedUserId: string,
  requestedUserId = authenticatedUserId
): Promise<DashboardAccessResult> {
  if (requestedUserId !== authenticatedUserId) {
    return { status: 403, error: 'You can only access your own dashboard.' };
  }

  const user = await getPublicUserById(authenticatedUserId);
  if (!user) return { status: 404, error: 'User not found.' };

  const ratingHistory = await getRatingHistoryForUser(authenticatedUserId);
  const recentResults = await getRecentRankedResultsForUser(authenticatedUserId, 5);
  const decidedGames = user.wins + user.losses;
  const winPercentage = decidedGames === 0 ? 0 : Math.round((user.wins / decidedGames) * 100);
  const peakElo = Math.max(user.eloRating, ...ratingHistory.map((entry) => entry.ratingAfter));
  const recentEloChange = ratingHistory.at(-1)?.ratingChange ?? 0;

  return {
    status: 200,
    dashboard: {
      user: {
        username: user.username,
        eloRating: user.eloRating,
        wins: user.wins,
        losses: user.losses,
        gamesPlayed: user.gamesPlayed,
        winPercentage,
      },
      ratingHistory,
      peakElo,
      recentEloChange,
      recentResults,
    },
  };
}

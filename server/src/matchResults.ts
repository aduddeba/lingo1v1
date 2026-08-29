import { runUserDatabaseTransaction, type StoredMatchResult, type UserDatabase } from '@/lib/auth/users';
import type { PlayerScore, RatingResult } from '@/types';
import { calculateEloMatchResult } from './elo';
import type { LobbyPlayer } from './state';

export interface CompletedRankedMatch {
  matchResult: StoredMatchResult;
  ratingResults: Record<string, RatingResult>;
  alreadyFinalized: boolean;
}

export interface RankedMatchCompletionInput {
  matchId: string;
  players: readonly [LobbyPlayer, LobbyPlayer];
  scores: Record<string, PlayerScore>;
  createdAt: number;
  completedAt?: number;
  ranked?: boolean;
  outcome?: { type: 'score' } | { type: 'server_forced'; winnerId: string };
}

function resultFor(playerId: string, winnerId: string | null): RatingResult['result'] {
  if (winnerId === null) return 'draw';
  return winnerId === playerId ? 'win' : 'loss';
}

export function determineWinnerFromScores(
  players: readonly [LobbyPlayer, LobbyPlayer],
  scores: Record<string, PlayerScore>
): string | null {
  const [a, b] = players;
  const scoreA = scores[a.player.id]?.score ?? 0;
  const scoreB = scores[b.player.id]?.score ?? 0;
  if (scoreA === scoreB) return null;
  return scoreA > scoreB ? a.player.id : b.player.id;
}

export async function completeRankedMatch(
  input: RankedMatchCompletionInput
): Promise<CompletedRankedMatch | null> {
  const [player1, player2] = input.players;
  const player1Id = player1.authenticatedUserId;
  const player2Id = player2.authenticatedUserId;

  if (input.ranked === false) return null;
  if (!player1Id || !player2Id) return null;

  return runUserDatabaseTransaction((database) => {
    const existing = database.matches.find((match) => match.id === input.matchId);
    if (existing) {
      return {
        matchResult: existing,
        ratingResults: buildRatingResults(existing),
        alreadyFinalized: true,
      };
    }

    const user1 = database.users.find((user) => user.id === player1Id);
    const user2 = database.users.find((user) => user.id === player2Id);
    if (!user1 || !user2) return null;

    const player1Score = input.scores[player1.player.id]?.score ?? 0;
    const player2Score = input.scores[player2.player.id]?.score ?? 0;
    const winnerId =
      input.outcome?.type === 'server_forced'
        ? input.outcome.winnerId
        : determineWinnerFromScores(input.players, input.scores);
    const eloScore1 = winnerId === null ? 0.5 : winnerId === player1.player.id ? 1 : 0;
    const eloResult = calculateEloMatchResult(user1.eloRating, user2.eloRating, eloScore1);

    const matchResult: StoredMatchResult = {
      id: input.matchId,
      player1Id,
      player2Id,
      winnerId,
      player1Score,
      player2Score,
      player1RatingBefore: eloResult.playerA.previousRating,
      player1RatingAfter: eloResult.playerA.newRating,
      player2RatingBefore: eloResult.playerB.previousRating,
      player2RatingAfter: eloResult.playerB.newRating,
      status: 'completed',
      ranked: true,
      createdAt: input.createdAt,
      completedAt: input.completedAt ?? Date.now(),
    };

    user1.eloRating = eloResult.playerA.newRating;
    user2.eloRating = eloResult.playerB.newRating;
    user1.gamesPlayed += 1;
    user2.gamesPlayed += 1;

    if (winnerId === player1.player.id) {
      user1.wins += 1;
      user2.losses += 1;
    } else if (winnerId === player2.player.id) {
      user2.wins += 1;
      user1.losses += 1;
    }

    database.matches.push(matchResult);
    addRatingHistoryEntry(database, {
      userId: player1Id,
      matchId: input.matchId,
      ratingBefore: matchResult.player1RatingBefore,
      ratingAfter: matchResult.player1RatingAfter,
      createdAt: matchResult.completedAt,
    });
    addRatingHistoryEntry(database, {
      userId: player2Id,
      matchId: input.matchId,
      ratingBefore: matchResult.player2RatingBefore,
      ratingAfter: matchResult.player2RatingAfter,
      createdAt: matchResult.completedAt,
    });

    return {
      matchResult,
      ratingResults: buildRatingResults(matchResult),
      alreadyFinalized: false,
    };
  });
}

function addRatingHistoryEntry(
  database: UserDatabase,
  input: {
    userId: string;
    matchId: string;
    ratingBefore: number;
    ratingAfter: number;
    createdAt: number;
  }
): void {
  const id = `${input.matchId}:${input.userId}`;
  if (database.ratingHistory.some((entry) => entry.id === id)) return;

  database.ratingHistory.push({
    id,
    userId: input.userId,
    matchId: input.matchId,
    ratingBefore: input.ratingBefore,
    ratingAfter: input.ratingAfter,
    ratingChange: input.ratingAfter - input.ratingBefore,
    createdAt: input.createdAt,
  });
}

function buildRatingResults(matchResult: StoredMatchResult): Record<string, RatingResult> {
  return {
    [matchResult.player1Id]: {
      result: resultFor(matchResult.player1Id, matchResult.winnerId),
      previousRating: matchResult.player1RatingBefore,
      newRating: matchResult.player1RatingAfter,
      ratingChange: matchResult.player1RatingAfter - matchResult.player1RatingBefore,
    },
    [matchResult.player2Id]: {
      result: resultFor(matchResult.player2Id, matchResult.winnerId),
      previousRating: matchResult.player2RatingBefore,
      newRating: matchResult.player2RatingAfter,
      ratingChange: matchResult.player2RatingAfter - matchResult.player2RatingBefore,
    },
  };
}

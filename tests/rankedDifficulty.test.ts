import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  GUEST_ELO_RATING,
  getQuestionDifficultyDistribution,
  getRankedQueueKey,
  resolveAuthoritativeMatchElo,
  selectDifficultyFromDistribution,
  selectRankedQuestionDifficulty,
} from '../server/src/rankedDifficulty';
import type { LobbyPlayer } from '../server/src/state';
import type { PublicUser } from '@/types';

function distributionEntries(eloRating: number): Record<string, number> {
  return Object.fromEntries(
    getQuestionDifficultyDistribution(eloRating).map(({ difficulty, weight }) => [
      difficulty,
      weight,
    ])
  );
}

function lobbyPlayer(input: {
  id: string;
  rating: number;
  authenticatedUserId?: string;
}): LobbyPlayer {
  return {
    socketId: `socket-${input.id}`,
    authenticatedUserId: input.authenticatedUserId,
    player: {
      id: input.id,
      username: input.id,
      avatarUrl: null,
      status: 'in_lobby',
      rating: input.rating,
      wins: 0,
      losses: 0,
      createdAt: Date.now(),
    },
  };
}

function publicUser(id: string, eloRating: number): PublicUser {
  return {
    id,
    username: id,
    email: `${id}@example.com`,
    eloRating,
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
    createdAt: Date.now(),
  };
}

describe('ranked question difficulty distribution', () => {
  it('is Easy-heavy for low Elo players', () => {
    assert.deepEqual(distributionEntries(899), { easy: 75, medium: 20, hard: 5 });
    assert.equal(
      selectDifficultyFromDistribution(getQuestionDifficultyDistribution(899), () => 0.5),
      'easy'
    );
  });

  it('is Hard-heavy for high Elo players', () => {
    assert.deepEqual(distributionEntries(1500), { easy: 10, medium: 30, hard: 60 });
    assert.equal(
      selectDifficultyFromDistribution(getQuestionDifficultyDistribution(1500), () => 0.9),
      'hard'
    );
  });

  it('uses the expected boundary Elo values', () => {
    assert.deepEqual(distributionEntries(900), { easy: 55, medium: 35, hard: 10 });
    assert.deepEqual(distributionEntries(1100), { easy: 35, medium: 45, hard: 20 });
    assert.deepEqual(distributionEntries(1300), { easy: 20, medium: 45, hard: 35 });
    assert.deepEqual(distributionEntries(1500), { easy: 10, medium: 30, hard: 60 });
  });

  it('ignores client difficulty values for ranked matchmaking', () => {
    assert.equal(getRankedQueueKey('easy'), 'ranked');
    assert.equal(getRankedQueueKey('hard'), 'ranked');
    assert.equal(getRankedQueueKey('mixed'), 'ranked');
    assert.equal(getRankedQueueKey(undefined), 'ranked');
  });

  it('uses guest fallback Elo when guests are in the match', async () => {
    const matchElo = await resolveAuthoritativeMatchElo([
      lobbyPlayer({ id: 'guest-a', rating: 0 }),
      lobbyPlayer({ id: 'guest-b', rating: 0 }),
    ]);

    assert.equal(matchElo, GUEST_ELO_RATING);
    assert.deepEqual(distributionEntries(matchElo), { easy: 55, medium: 35, hard: 10 });
  });

  it('loads authoritative Elo for authenticated users instead of player payload ratings', async () => {
    const players = [
      lobbyPlayer({ id: 'user-a', authenticatedUserId: 'user-a', rating: 100 }),
      lobbyPlayer({ id: 'user-b', authenticatedUserId: 'user-b', rating: 100 }),
    ];
    const loadUser = async (id: string) => publicUser(id, 1600);

    const difficulty = await selectRankedQuestionDifficulty(players, () => 0.9, loadUser);

    assert.equal(difficulty, 'hard');
  });
});

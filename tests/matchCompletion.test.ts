import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  evaluateMatchProgress,
  getRoundAdvanceDecision,
} from '../server/src/matchCompletion';
import type { LobbyPlayer } from '../server/src/state';
import type { PlayerScore } from '@/types';

const TARGET_SCORE = 3_000;
const MAX_ROUNDS = 12;

function lobbyPlayer(id: string): LobbyPlayer {
  return {
    socketId: `socket-${id}`,
    authenticatedUserId: id,
    player: {
      id,
      username: id,
      avatarUrl: null,
      status: 'in_lobby',
      rating: 1000,
      wins: 0,
      losses: 0,
      createdAt: Date.now(),
    },
  };
}

function playerScore(playerId: string, score: number): PlayerScore {
  return {
    playerId,
    score,
    streak: 0,
    answersCorrect: 0,
    answersTotal: 0,
  };
}

function progress(player1Score: number, player2Score: number, roundsPlayed: number) {
  const players = [lobbyPlayer('player-a'), lobbyPlayer('player-b')] as const;

  return evaluateMatchProgress({
    players,
    scores: {
      'player-a': playerScore('player-a', player1Score),
      'player-b': playerScore('player-b', player2Score),
    },
    roundsPlayed,
    targetScore: TARGET_SCORE,
    maxRounds: MAX_ROUNDS,
  });
}

describe('hybrid match completion rules', () => {
  it('continues when neither target nor round limit is met', () => {
    assert.deepEqual(progress(1500, 1200, 5), {
      finished: false,
      reason: null,
      winnerId: null,
    });
  });

  it('ends when a player reaches the target score', () => {
    assert.deepEqual(progress(3100, 2600, 6), {
      finished: true,
      reason: 'target_score',
      winnerId: 'player-a',
    });
  });

  it('ends when a player lands exactly on the target score', () => {
    assert.deepEqual(progress(3000, 2990, 6), {
      finished: true,
      reason: 'target_score',
      winnerId: 'player-a',
    });
  });

  it('ends when a player exceeds the target score', () => {
    assert.deepEqual(progress(3390, 2990, 6), {
      finished: true,
      reason: 'target_score',
      winnerId: 'player-a',
    });
  });

  it('ends at the maximum round limit', () => {
    assert.equal(progress(2200, 2100, 12).finished, true);
    assert.equal(progress(2200, 2100, 12).reason, 'round_limit');
  });

  it('selects the higher score when the round limit is reached', () => {
    assert.deepEqual(progress(2840, 2910, 12), {
      finished: true,
      reason: 'round_limit',
      winnerId: 'player-b',
    });
  });

  it('does not advance to another round after target victory', () => {
    const result = progress(3150, 2200, 8);

    assert.equal(getRoundAdvanceDecision(result, true), 'finish_match');
  });

  it('does not advance to another round after round-limit victory', () => {
    const result = progress(2910, 2840, 12);

    assert.equal(getRoundAdvanceDecision(result, false), 'finish_match');
  });

  it('declares a draw when scores are tied at the round limit', () => {
    assert.deepEqual(progress(2600, 2600, 12), {
      finished: true,
      reason: 'draw',
      winnerId: null,
    });
  });

  it('handles simultaneous target crossing by comparing final round scores', () => {
    assert.deepEqual(progress(3150, 3250, 8), {
      finished: true,
      reason: 'target_score',
      winnerId: 'player-b',
    });
  });

  it('declares a draw when simultaneous target crossing ends tied', () => {
    assert.deepEqual(progress(3200, 3200, 8), {
      finished: true,
      reason: 'draw',
      winnerId: null,
    });
  });
});

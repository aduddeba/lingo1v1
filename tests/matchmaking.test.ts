import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canPlayersBeMatched } from '../server/src/matchmaking';
import type { Player } from '@/types';

function player(id: string): Player {
  return {
    id,
    username: id,
    avatarUrl: null,
    status: 'in_lobby',
    rating: 1000,
    wins: 0,
    losses: 0,
    createdAt: Date.now(),
  };
}

describe('matchmaking identity checks', () => {
  it('does not match the same authenticated user against themselves', () => {
    assert.equal(canPlayersBeMatched(player('user-1'), player('user-1')), false);
  });

  it('does not match players with the same display name when auth is unavailable', () => {
    const first = player('guest-1');
    const second = player('guest-2');
    first.username = 'lingoat';
    second.username = 'Lingoat';

    assert.equal(canPlayersBeMatched(first, second), false);
  });

  it('allows distinct users to be matched', () => {
    const first = player('user-1');
    const second = player('user-2');
    second.username = 'different-user';

    assert.equal(canPlayersBeMatched(first, second), true);
  });
});



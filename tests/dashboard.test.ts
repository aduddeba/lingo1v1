import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { createUser, runUserDatabaseTransaction } from '@/lib/auth/users';
import { getDashboardDataForUser } from '@/lib/dashboard';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'lingo-dashboard-test-'));
  process.env['LINGO_DATA_DIR'] = tempDir;
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
  delete process.env['LINGO_DATA_DIR'];
});

async function createDashboardUser(username: string) {
  return createUser({
    username,
    email: `${username}@example.com`,
    passwordHash: 'scrypt:test',
  });
}

describe('competitive dashboard data', () => {
  it('returns the authenticated user dashboard data', async () => {
    const user = await createDashboardUser('dashboard-owner');

    const result = await getDashboardDataForUser(user.id);

    assert.equal(result.status, 200);
    if (result.status === 200) {
      assert.equal(result.dashboard.user.username, 'dashboard-owner');
      assert.equal(result.dashboard.user.eloRating, 1000);
      assert.deepEqual(result.dashboard.ratingHistory, []);
    }
  });

  it('returns rating history chronologically', async () => {
    const user = await createDashboardUser('history-owner');

    await runUserDatabaseTransaction((database) => {
      database.ratingHistory.push(
        {
          id: `later:${user.id}`,
          userId: user.id,
          matchId: 'later',
          ratingBefore: 1016,
          ratingAfter: 1030,
          ratingChange: 14,
          createdAt: 3_000,
        },
        {
          id: `earlier:${user.id}`,
          userId: user.id,
          matchId: 'earlier',
          ratingBefore: 1000,
          ratingAfter: 1016,
          ratingChange: 16,
          createdAt: 2_000,
        }
      );
    });

    const result = await getDashboardDataForUser(user.id);

    assert.equal(result.status, 200);
    if (result.status === 200) {
      assert.deepEqual(
        result.dashboard.ratingHistory.map((entry) => entry.matchId),
        ['earlier', 'later']
      );
    }
  });

  it('calculates win percentage from wins and losses', async () => {
    const user = await createDashboardUser('winning-owner');

    await runUserDatabaseTransaction((database) => {
      const storedUser = database.users.find((candidate) => candidate.id === user.id);
      if (!storedUser) throw new Error('missing user');
      storedUser.wins = 3;
      storedUser.losses = 1;
      storedUser.gamesPlayed = 5;
    });

    const result = await getDashboardDataForUser(user.id);

    assert.equal(result.status, 200);
    if (result.status === 200) assert.equal(result.dashboard.user.winPercentage, 75);
  });

  it('handles zero games without dividing by zero', async () => {
    const user = await createDashboardUser('new-owner');

    const result = await getDashboardDataForUser(user.id);

    assert.equal(result.status, 200);
    if (result.status === 200) {
      assert.equal(result.dashboard.user.gamesPlayed, 0);
      assert.equal(result.dashboard.user.winPercentage, 0);
      assert.equal(result.dashboard.peakElo, 1000);
      assert.equal(result.dashboard.recentEloChange, 0);
    }
  });

  it('excludes sensitive fields from the dashboard payload', async () => {
    const user = await createDashboardUser('private-owner');

    const result = await getDashboardDataForUser(user.id);

    assert.equal(result.status, 200);
    if (result.status === 200) {
      assert.equal('email' in result.dashboard.user, false);
      assert.equal('passwordHash' in result.dashboard.user, false);
    }
  });

  it('does not allow one user to retrieve another user private dashboard', async () => {
    const first = await createDashboardUser('first-owner');
    const second = await createDashboardUser('second-owner');

    const result = await getDashboardDataForUser(first.id, second.id);

    assert.equal(result.status, 403);
  });
});

import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
  createUser,
  getCompetitiveStandingForUser,
  runUserDatabaseTransaction,
} from '@/lib/auth/users';
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

async function createRankedDashboardUser(input: {
  username: string;
  eloRating: number;
  wins: number;
  gamesPlayed: number;
}) {
  const user = await createDashboardUser(input.username);

  await runUserDatabaseTransaction((database) => {
    const storedUser = database.users.find((candidate) => candidate.id === user.id);
    if (!storedUser) throw new Error('missing user');

    storedUser.eloRating = input.eloRating;
    storedUser.wins = input.wins;
    storedUser.gamesPlayed = input.gamesPlayed;
    storedUser.losses = Math.max(0, input.gamesPlayed - input.wins);
    database.ratingHistory.push({
      id: `history:${user.id}`,
      userId: user.id,
      matchId: `match:${user.id}`,
      ratingBefore: 1000,
      ratingAfter: input.eloRating,
      ratingChange: input.eloRating - 1000,
      createdAt: Date.now(),
    });
  });

  return user;
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

  it('ranks the highest-rated user first with the top percentile', async () => {
    const highest = await createRankedDashboardUser({
      username: 'highest',
      eloRating: 1500,
      wins: 3,
      gamesPlayed: 3,
    });
    await createRankedDashboardUser({ username: 'middle', eloRating: 1200, wins: 2, gamesPlayed: 3 });
    await createRankedDashboardUser({ username: 'lowest', eloRating: 900, wins: 1, gamesPlayed: 3 });

    const standing = await getCompetitiveStandingForUser(highest.id);

    assert.deepEqual(standing, {
      rank: 1,
      totalRankedUsers: 3,
      percentile: 100,
      topPercent: 34,
    });
  });

  it('calculates the lowest-rated user percentile boundary', async () => {
    await createRankedDashboardUser({ username: 'highest', eloRating: 1500, wins: 3, gamesPlayed: 3 });
    await createRankedDashboardUser({ username: 'middle', eloRating: 1200, wins: 2, gamesPlayed: 3 });
    const lowest = await createRankedDashboardUser({
      username: 'lowest',
      eloRating: 900,
      wins: 1,
      gamesPlayed: 3,
    });

    const standing = await getCompetitiveStandingForUser(lowest.id);

    assert.deepEqual(standing, {
      rank: 3,
      totalRankedUsers: 3,
      percentile: 33,
      topPercent: 100,
    });
  });

  it("calculates a middle user's rank and percentile", async () => {
    await createRankedDashboardUser({ username: 'highest', eloRating: 1500, wins: 3, gamesPlayed: 3 });
    const middle = await createRankedDashboardUser({
      username: 'middle',
      eloRating: 1200,
      wins: 2,
      gamesPlayed: 3,
    });
    await createRankedDashboardUser({ username: 'lowest', eloRating: 900, wins: 1, gamesPlayed: 3 });

    const standing = await getCompetitiveStandingForUser(middle.id);

    assert.deepEqual(standing, {
      rank: 2,
      totalRankedUsers: 3,
      percentile: 67,
      topPercent: 67,
    });
  });

  it('uses deterministic tie breakers after Elo', async () => {
    const alpha = await createRankedDashboardUser({
      username: 'alpha',
      eloRating: 1200,
      wins: 10,
      gamesPlayed: 10,
    });
    const bravo = await createRankedDashboardUser({
      username: 'bravo',
      eloRating: 1200,
      wins: 10,
      gamesPlayed: 8,
    });
    const charlie = await createRankedDashboardUser({
      username: 'charlie',
      eloRating: 1200,
      wins: 9,
      gamesPlayed: 8,
    });
    const delta = await createRankedDashboardUser({
      username: 'delta',
      eloRating: 1200,
      wins: 10,
      gamesPlayed: 10,
    });

    assert.equal((await getCompetitiveStandingForUser(bravo.id)).rank, 1);
    assert.equal((await getCompetitiveStandingForUser(alpha.id)).rank, 2);
    assert.equal((await getCompetitiveStandingForUser(delta.id)).rank, 3);
    assert.equal((await getCompetitiveStandingForUser(charlie.id)).rank, 4);
  });

  it('treats users with no ranked matches as unranked', async () => {
    const ranked = await createRankedDashboardUser({
      username: 'ranked',
      eloRating: 1100,
      wins: 1,
      gamesPlayed: 1,
    });
    const unranked = await createDashboardUser('unranked');

    assert.deepEqual(await getCompetitiveStandingForUser(unranked.id), {
      rank: null,
      totalRankedUsers: 1,
      percentile: null,
      topPercent: null,
    });
    assert.equal((await getCompetitiveStandingForUser(ranked.id)).rank, 1);
  });

  it('handles zero ranked users', async () => {
    const user = await createDashboardUser('brand-new');

    assert.deepEqual(await getCompetitiveStandingForUser(user.id), {
      rank: null,
      totalRankedUsers: 0,
      percentile: null,
      topPercent: null,
    });
  });

  it('includes competitive standing in the dashboard payload', async () => {
    const user = await createRankedDashboardUser({
      username: 'standing-owner',
      eloRating: 1300,
      wins: 2,
      gamesPlayed: 2,
    });

    const result = await getDashboardDataForUser(user.id);

    assert.equal(result.status, 200);
    if (result.status === 200) {
      assert.deepEqual(result.dashboard.competitiveStanding, {
        rank: 1,
        totalRankedUsers: 1,
        percentile: 100,
        topPercent: 100,
      });
    }
  });
});

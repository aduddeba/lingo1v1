import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { createUser, getLeaderboardPage, runUserDatabaseTransaction } from '@/lib/auth/users';
import { getDashboardDataForUser } from '@/lib/dashboard';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'lingo-leaderboard-test-'));
  process.env['LINGO_DATA_DIR'] = tempDir;
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
  delete process.env['LINGO_DATA_DIR'];
});

async function createLeaderboardUser(input: {
  username: string;
  eloRating: number;
  wins: number;
  losses?: number;
  gamesPlayed: number;
}) {
  const user = await createUser({
    username: input.username,
    email: `${input.username}@example.com`,
    passwordHash: 'scrypt:test',
  });

  await runUserDatabaseTransaction((database) => {
    const storedUser = database.users.find((candidate) => candidate.id === user.id);
    if (!storedUser) throw new Error('missing user');

    storedUser.eloRating = input.eloRating;
    storedUser.wins = input.wins;
    storedUser.losses = input.losses ?? Math.max(0, input.gamesPlayed - input.wins);
    storedUser.gamesPlayed = input.gamesPlayed;
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

describe('public Elo leaderboard', () => {
  it('orders users by Elo descending', async () => {
    await createLeaderboardUser({ username: 'middle', eloRating: 1200, wins: 2, gamesPlayed: 3 });
    await createLeaderboardUser({ username: 'highest', eloRating: 1500, wins: 3, gamesPlayed: 3 });
    await createLeaderboardUser({ username: 'lowest', eloRating: 900, wins: 1, gamesPlayed: 3 });

    const leaderboard = await getLeaderboardPage({});

    assert.deepEqual(
      leaderboard.entries.map((entry) => entry.username),
      ['highest', 'middle', 'lowest']
    );
  });

  it('uses the same deterministic tie breakers as dashboard rank', async () => {
    await createLeaderboardUser({ username: 'alpha', eloRating: 1200, wins: 10, gamesPlayed: 10 });
    await createLeaderboardUser({ username: 'bravo', eloRating: 1200, wins: 10, gamesPlayed: 8 });
    await createLeaderboardUser({ username: 'charlie', eloRating: 1200, wins: 9, gamesPlayed: 8 });
    await createLeaderboardUser({ username: 'delta', eloRating: 1200, wins: 10, gamesPlayed: 10 });

    const leaderboard = await getLeaderboardPage({});

    assert.deepEqual(
      leaderboard.entries.map((entry) => `${entry.rank}:${entry.username}`),
      ['1:bravo', '2:alpha', '3:delta', '4:charlie']
    );
  });

  it('paginates ranked users and validates oversized limits server-side', async () => {
    await createLeaderboardUser({ username: 'first', eloRating: 1500, wins: 5, gamesPlayed: 5 });
    await createLeaderboardUser({ username: 'second', eloRating: 1400, wins: 4, gamesPlayed: 5 });
    await createLeaderboardUser({ username: 'third', eloRating: 1300, wins: 3, gamesPlayed: 5 });

    const pageTwo = await getLeaderboardPage({ page: 2, pageSize: 2 });
    const capped = await getLeaderboardPage({ pageSize: 200 });

    assert.equal(pageTwo.page, 2);
    assert.equal(pageTwo.pageSize, 2);
    assert.equal(pageTwo.totalPages, 2);
    assert.deepEqual(pageTwo.entries.map((entry) => entry.username), ['third']);
    assert.equal(capped.pageSize, 25);
  });

  it('marks the current user on their leaderboard row', async () => {
    await createLeaderboardUser({ username: 'first', eloRating: 1500, wins: 5, gamesPlayed: 5 });
    const currentUser = await createLeaderboardUser({
      username: 'current',
      eloRating: 1400,
      wins: 4,
      gamesPlayed: 5,
    });

    const leaderboard = await getLeaderboardPage({ currentUserId: currentUser.id });
    const currentRow = leaderboard.entries.find((entry) => entry.username === 'current');

    assert.equal(currentRow?.isCurrentUser, true);
    assert.equal(leaderboard.currentUser?.rank, 2);
  });

  it('returns current user rank separately when they are not on the current page', async () => {
    const currentUser = await createLeaderboardUser({
      username: 'third',
      eloRating: 1300,
      wins: 3,
      gamesPlayed: 5,
    });
    await createLeaderboardUser({ username: 'first', eloRating: 1500, wins: 5, gamesPlayed: 5 });
    await createLeaderboardUser({ username: 'second', eloRating: 1400, wins: 4, gamesPlayed: 5 });

    const leaderboard = await getLeaderboardPage({
      page: 1,
      pageSize: 2,
      currentUserId: currentUser.id,
    });

    assert.deepEqual(leaderboard.entries.map((entry) => entry.username), ['first', 'second']);
    assert.equal(leaderboard.entries.some((entry) => entry.isCurrentUser), false);
    assert.equal(leaderboard.currentUser?.rank, 3);
    assert.equal(leaderboard.currentUser?.eloRating, 1300);
    assert.equal(leaderboard.currentUser?.topPercent, 100);
  });

  it('excludes private fields from leaderboard payloads', async () => {
    await createLeaderboardUser({
      username: 'public-player',
      eloRating: 1300,
      wins: 2,
      gamesPlayed: 2,
    });

    const leaderboard = await getLeaderboardPage({});
    const serialized = JSON.stringify(leaderboard);

    assert.equal(serialized.includes('email'), false);
    assert.equal(serialized.includes('passwordHash'), false);
    assert.equal(serialized.includes('scrypt:test'), false);
  });

  it('matches the dashboard rank for the current user', async () => {
    await createLeaderboardUser({ username: 'top', eloRating: 1500, wins: 5, gamesPlayed: 5 });
    const currentUser = await createLeaderboardUser({
      username: 'dashboard-same',
      eloRating: 1400,
      wins: 4,
      gamesPlayed: 5,
    });
    await createLeaderboardUser({ username: 'bottom', eloRating: 900, wins: 1, gamesPlayed: 5 });

    const leaderboard = await getLeaderboardPage({ currentUserId: currentUser.id });
    const dashboard = await getDashboardDataForUser(currentUser.id);

    assert.equal(dashboard.status, 200);
    if (dashboard.status === 200) {
      assert.equal(leaderboard.currentUser?.rank, dashboard.dashboard.competitiveStanding.rank);
      assert.equal(
        leaderboard.currentUser?.topPercent,
        dashboard.dashboard.competitiveStanding.topPercent
      );
    }
  });

  it('omits users with no ranked matches', async () => {
    await createLeaderboardUser({ username: 'ranked', eloRating: 1100, wins: 1, gamesPlayed: 1 });
    await createUser({
      username: 'unranked',
      email: 'unranked@example.com',
      passwordHash: 'scrypt:test',
    });

    const leaderboard = await getLeaderboardPage({});

    assert.deepEqual(leaderboard.entries.map((entry) => entry.username), ['ranked']);
    assert.equal(leaderboard.totalRankedUsers, 1);
  });
});

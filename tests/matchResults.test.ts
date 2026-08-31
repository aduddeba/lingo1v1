import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
  runUserDatabaseTransaction,
  createUser,
  getRatingHistoryForUser,
  type UserDatabase,
} from '@/lib/auth/users';
import {
  completeRankedMatch,
  determineWinnerFromScores,
  type RankedMatchCompletionInput,
} from '../server/src/matchResults';
import type { LobbyPlayer } from '../server/src/state';
import type { PlayerScore } from '@/types';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'lingo-match-results-test-'));
  process.env['LINGO_DATA_DIR'] = tempDir;
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
  delete process.env['LINGO_DATA_DIR'];
});

async function readDatabase(): Promise<UserDatabase> {
  return JSON.parse(await readFile(path.join(tempDir, 'users.json'), 'utf8')) as UserDatabase;
}

async function createRatedUser(username: string, rating: number) {
  const user = await createUser({
    username,
    email: `${username}@example.com`,
    passwordHash: 'scrypt:test',
  });

  await runUserDatabaseTransaction((database) => {
    const storedUser = database.users.find((candidate) => candidate.id === user.id);
    if (!storedUser) throw new Error('missing user');
    storedUser.eloRating = rating;
  });

  return { ...user, eloRating: rating };
}

function lobbyPlayer(id: string, rating: number, authenticated = true): LobbyPlayer {
  return {
    socketId: `socket-${id}`,
    authenticatedUserId: authenticated ? id : undefined,
    player: {
      id,
      username: id,
      avatarUrl: null,
      status: 'in_lobby',
      rating,
      wins: 0,
      losses: 0,
      createdAt: Date.now(),
    },
  };
}

function scores(player1Id: string, player1Score: number, player2Id: string, player2Score: number) {
  return {
    [player1Id]: playerScore(player1Id, player1Score),
    [player2Id]: playerScore(player2Id, player2Score),
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

async function completionInput(
  matchId: string,
  player1Rating: number,
  player2Rating: number,
  player1Score: number,
  player2Score: number
): Promise<RankedMatchCompletionInput> {
  const player1 = await createRatedUser(`${matchId}-a`, player1Rating);
  const player2 = await createRatedUser(`${matchId}-b`, player2Rating);
  const players = [
    lobbyPlayer(player1.id, player1.eloRating),
    lobbyPlayer(player2.id, player2.eloRating),
  ] as const;

  return {
    matchId,
    players,
    scores: scores(player1.id, player1Score, player2.id, player2Score),
    createdAt: 1_000,
    completedAt: 2_000,
    outcome: { type: 'score' },
  };
}

function completionInputForPlayers(
  matchId: string,
  player1: { id: string; eloRating: number },
  player2: { id: string; eloRating: number },
  player1Score: number,
  player2Score: number,
  completedAt: number
): RankedMatchCompletionInput {
  const players = [
    lobbyPlayer(player1.id, player1.eloRating),
    lobbyPlayer(player2.id, player2.eloRating),
  ] as const;

  return {
    matchId,
    players,
    scores: scores(player1.id, player1Score, player2.id, player2Score),
    createdAt: completedAt - 1_000,
    completedAt,
    outcome: { type: 'score' },
  };
}

describe('ranked match completion persistence', () => {
  it('updates wins, losses, games played, and Elo for a completed match', async () => {
    const input = await completionInput('match-1', 1000, 1000, 500, 200);

    const completion = await completeRankedMatch(input);
    const database = await readDatabase();
    const [player1, player2] = input.players;
    const storedPlayer1 = database.users.find((user) => user.id === player1.authenticatedUserId);
    const storedPlayer2 = database.users.find((user) => user.id === player2.authenticatedUserId);

    assert.equal(completion?.alreadyFinalized, false);
    assert.equal(storedPlayer1?.eloRating, 1005);
    assert.equal(storedPlayer1?.wins, 1);
    assert.equal(storedPlayer1?.losses, 0);
    assert.equal(storedPlayer1?.gamesPlayed, 1);
    assert.equal(storedPlayer2?.eloRating, 995);
    assert.equal(storedPlayer2?.wins, 0);
    assert.equal(storedPlayer2?.losses, 1);
    assert.equal(storedPlayer2?.gamesPlayed, 1);
    assert.equal(database.matches.length, 1);
    assert.equal(database.ratingHistory.length, 2);
    assert.equal(completion?.ratingResults[player1.authenticatedUserId ?? '']?.result, 'win');
  });

  it('persists rounds played and target-score completion reason', async () => {
    const input = await completionInput('match-target-reason', 1000, 1000, 3100, 2200);

    await completeRankedMatch({
      ...input,
      roundsPlayed: 8,
      completionReason: 'target_score',
    });
    const database = await readDatabase();

    assert.equal(database.matches[0]?.roundsPlayed, 8);
    assert.equal(database.matches[0]?.completionReason, 'target_score');
  });

  it('updates Elo exactly once for target-score completion', async () => {
    const input = await completionInput('match-target-once', 1000, 1000, 3100, 2200);

    await completeRankedMatch({
      ...input,
      roundsPlayed: 8,
      completionReason: 'target_score',
    });
    await completeRankedMatch({
      ...input,
      roundsPlayed: 8,
      completionReason: 'target_score',
    });
    const database = await readDatabase();

    assert.equal(database.matches.length, 1);
    assert.equal(database.ratingHistory.length, 2);
    assert.deepEqual(
      database.users.map((user) => user.gamesPlayed),
      [1, 1]
    );
  });

  it('updates Elo exactly once for round-limit completion', async () => {
    const input = await completionInput('match-round-limit-once', 1000, 1000, 2910, 2840);

    await completeRankedMatch({
      ...input,
      roundsPlayed: 12,
      completionReason: 'round_limit',
    });
    await completeRankedMatch({
      ...input,
      roundsPlayed: 12,
      completionReason: 'round_limit',
    });
    const database = await readDatabase();

    assert.equal(database.matches.length, 1);
    assert.equal(database.ratingHistory.length, 2);
    assert.deepEqual(
      database.users.map((user) => user.gamesPlayed),
      [1, 1]
    );
  });

  it('creates one rating history entry for each ranked player', async () => {
    const input = await completionInput('match-history', 1000, 1000, 500, 200);
    const [player1, player2] = input.players;

    await completeRankedMatch(input);
    const player1History = await getRatingHistoryForUser(player1.authenticatedUserId ?? '');
    const player2History = await getRatingHistoryForUser(player2.authenticatedUserId ?? '');

    assert.deepEqual(player1History, [
      {
        matchId: 'match-history',
        ratingBefore: 1000,
        ratingAfter: 1005,
        ratingChange: 5,
        createdAt: 2_000,
      },
    ]);
    assert.deepEqual(player2History, [
      {
        matchId: 'match-history',
        ratingBefore: 1000,
        ratingAfter: 995,
        ratingChange: -5,
        createdAt: 2_000,
      },
    ]);
  });

  it('does not update Elo or stats twice for duplicate completion', async () => {
    const input = await completionInput('match-duplicate', 1000, 1000, 500, 200);

    await completeRankedMatch(input);
    const duplicate = await completeRankedMatch(input);
    const database = await readDatabase();

    assert.equal(duplicate?.alreadyFinalized, true);
    assert.equal(database.matches.length, 1);
    assert.equal(database.ratingHistory.length, 2);
    assert.deepEqual(
      database.users.map((user) => ({
        eloRating: user.eloRating,
        wins: user.wins,
        losses: user.losses,
        gamesPlayed: user.gamesPlayed,
      })),
      [
        { eloRating: 1005, wins: 1, losses: 0, gamesPlayed: 1 },
        { eloRating: 995, wins: 0, losses: 1, gamesPlayed: 1 },
      ]
    );
  });

  it('makes narrow score-difference Elo changes smaller than wide wins', async () => {
    const narrowInput = await completionInput('match-narrow-margin', 1000, 1000, 3100, 3000);
    const wideInput = await completionInput('match-wide-margin', 1000, 1000, 3100, 100);

    const narrow = await completeRankedMatch(narrowInput);
    const wide = await completeRankedMatch(wideInput);
    const narrowChange =
      narrow?.ratingResults[narrowInput.players[0].authenticatedUserId ?? '']?.ratingChange ?? 0;
    const wideChange =
      wide?.ratingResults[wideInput.players[0].authenticatedUserId ?? '']?.ratingChange ?? 0;

    assert.ok(narrowChange > 0);
    assert.ok(wideChange > narrowChange);
  });

  it('keeps rating history changes consistent with before and after ratings', async () => {
    const input = await completionInput('match-history-change', 1400, 1000, 100, 900);

    await completeRankedMatch(input);
    const database = await readDatabase();

    for (const entry of database.ratingHistory) {
      assert.equal(entry.ratingChange, entry.ratingAfter - entry.ratingBefore);
    }
  });

  it('returns rating history chronologically for a user', async () => {
    const player1 = await createRatedUser('chrono-a', 1000);
    const player2 = await createRatedUser('chrono-b', 1000);

    await completeRankedMatch(completionInputForPlayers('late-match', player1, player2, 300, 100, 3_000));
    await completeRankedMatch(completionInputForPlayers('early-match', player1, player2, 100, 300, 2_000));

    const history = await getRatingHistoryForUser(player1.id);

    assert.deepEqual(
      history.map((entry) => entry.matchId),
      ['early-match', 'late-match']
    );
    assert.deepEqual(
      history.map((entry) => entry.createdAt),
      [2_000, 3_000]
    );
  });

  it('rolls back the JSON transaction when an update throws', async () => {
    const user = await createRatedUser('rollback', 1000);

    await assert.rejects(
      runUserDatabaseTransaction((database) => {
        const storedUser = database.users.find((candidate) => candidate.id === user.id);
        if (!storedUser) throw new Error('missing user');
        storedUser.eloRating = 2000;
        throw new Error('boom');
      }),
      /boom/
    );

    const database = await readDatabase();
    assert.equal(database.users[0]?.eloRating, 1000);
  });

  it('does not change Elo for guest matches', async () => {
    const user = await createRatedUser('guestmatch', 1000);
    const players = [lobbyPlayer(user.id, 1000), lobbyPlayer('guest-1', 0, false)] as const;

    const completion = await completeRankedMatch({
      matchId: 'guest-match',
      players,
      scores: scores(user.id, 500, 'guest-1', 100),
      createdAt: 1_000,
      completedAt: 2_000,
      outcome: { type: 'score' },
    });
    const database = await readDatabase();

    assert.equal(completion, null);
    assert.equal(database.users[0]?.eloRating, 1000);
    assert.equal(database.users[0]?.gamesPlayed, 0);
    assert.equal(database.matches.length, 0);
    assert.equal(database.ratingHistory.length, 0);
  });

  it('does not create rating history for casual matches', async () => {
    const input = await completionInput('casual-match', 1000, 1000, 500, 200);

    const completion = await completeRankedMatch({ ...input, ranked: false });
    const database = await readDatabase();

    assert.equal(completion, null);
    assert.equal(database.matches.length, 0);
    assert.equal(database.ratingHistory.length, 0);
  });

  it('ignores forged winner fields and computes score-based winners from server scores', async () => {
    const input = await completionInput('match-forged', 1000, 1000, 100, 900);
    const forgedInput = { ...input, winnerId: input.players[0].player.id };

    assert.equal(determineWinnerFromScores(input.players, input.scores), input.players[1].player.id);

    const completion = await completeRankedMatch(forgedInput);

    assert.equal(completion?.matchResult.winnerId, input.players[1].player.id);
    assert.equal(completion?.ratingResults[input.players[0].authenticatedUserId ?? '']?.result, 'loss');
  });
});

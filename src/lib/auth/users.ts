import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { PublicUser } from '@/types';

export interface StoredUser extends PublicUser {
  passwordHash: string;
}

export interface StoredMatchResult {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId: string | null;
  player1Score: number;
  player2Score: number;
  player1RatingBefore: number;
  player1RatingAfter: number;
  player2RatingBefore: number;
  player2RatingAfter: number;
  status: 'completed';
  ranked: boolean;
  createdAt: number;
  completedAt: number;
}

export interface StoredRatingHistoryEntry {
  id: string;
  userId: string;
  matchId: string;
  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;
  createdAt: number;
}

export interface PublicRatingHistoryEntry {
  matchId: string;
  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;
  createdAt: number;
}

export interface PublicRankedMatchSummary {
  matchId: string;
  result: 'win' | 'loss' | 'draw';
  scoreFor: number;
  scoreAgainst: number;
  ratingChange: number;
  createdAt: number;
}

export interface UserDatabase {
  users: StoredUser[];
  matches: StoredMatchResult[];
  ratingHistory: StoredRatingHistoryEntry[];
}

let transactionQueue = Promise.resolve();

function dataFilePath(): string {
  const cwd = process.cwd();
  const defaultDataDir =
    path.basename(cwd) === 'server' ? path.join(cwd, '..', 'data') : path.join(cwd, 'data');
  const dataDir = process.env['LINGO_DATA_DIR'] ?? defaultDataDir;
  return path.join(dataDir, 'users.json');
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    eloRating: user.eloRating,
    wins: user.wins,
    losses: user.losses,
    gamesPlayed: user.gamesPlayed,
    createdAt: user.createdAt,
  };
}

async function readDatabase(): Promise<UserDatabase> {
  const filePath = dataFilePath();
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<UserDatabase>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      matches: Array.isArray(parsed.matches) ? parsed.matches : [],
      ratingHistory: Array.isArray(parsed.ratingHistory) ? parsed.ratingHistory : [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { users: [], matches: [], ratingHistory: [] };
    }
    throw error;
  }
}

async function writeDatabase(database: UserDatabase): Promise<void> {
  const filePath = dataFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempPath, JSON.stringify(database, null, 2), 'utf8');
  await rename(tempPath, filePath);
}

export async function runUserDatabaseTransaction<T>(
  callback: (database: UserDatabase) => T | Promise<T>
): Promise<T> {
  const run = async (): Promise<T> => {
    const database = await readDatabase();
    const result = await callback(database);
    await writeDatabase(database);
    return result;
  };

  const result = transactionQueue.then(run, run);
  transactionQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

export async function createUser(input: {
  username: string;
  email: string;
  passwordHash: string;
}): Promise<PublicUser> {
  const username = input.username.trim();
  const email = normalizeEmail(input.email);
  const database = await readDatabase();

  if (database.users.some((user) => user.email === email)) {
    throw new Error('EMAIL_TAKEN');
  }

  if (database.users.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('USERNAME_TAKEN');
  }

  const user: StoredUser = {
    id: randomUUID(),
    username,
    email,
    passwordHash: input.passwordHash,
    eloRating: 1000,
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
    createdAt: Date.now(),
  };

  database.users.push(user);
  await writeDatabase(database);
  return toPublicUser(user);
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const database = await readDatabase();
  return database.users.find((user) => user.email === normalizeEmail(email)) ?? null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const database = await readDatabase();
  return database.users.find((user) => user.id === id) ?? null;
}

export async function getPublicUserById(id: string): Promise<PublicUser | null> {
  const user = await findUserById(id);
  return user ? toPublicUser(user) : null;
}

export async function getRatingHistoryForUser(
  userId: string
): Promise<PublicRatingHistoryEntry[]> {
  const database = await readDatabase();

  return database.ratingHistory
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => a.createdAt - b.createdAt || a.matchId.localeCompare(b.matchId))
    .map((entry) => ({
      matchId: entry.matchId,
      ratingBefore: entry.ratingBefore,
      ratingAfter: entry.ratingAfter,
      ratingChange: entry.ratingChange,
      createdAt: entry.createdAt,
    }));
}

export async function getRecentRankedResultsForUser(
  userId: string,
  limit = 5
): Promise<PublicRankedMatchSummary[]> {
  const database = await readDatabase();
  const ratingChanges = new Map(
    database.ratingHistory
      .filter((entry) => entry.userId === userId)
      .map((entry) => [entry.matchId, entry.ratingChange])
  );

  return database.matches
    .filter((match) => match.ranked && (match.player1Id === userId || match.player2Id === userId))
    .sort((a, b) => b.completedAt - a.completedAt || b.id.localeCompare(a.id))
    .slice(0, limit)
    .map((match) => {
      const isPlayer1 = match.player1Id === userId;
      const scoreFor = isPlayer1 ? match.player1Score : match.player2Score;
      const scoreAgainst = isPlayer1 ? match.player2Score : match.player1Score;
      const result =
        match.winnerId === null ? 'draw' : match.winnerId === userId ? 'win' : 'loss';

      return {
        matchId: match.id,
        result,
        scoreFor,
        scoreAgainst,
        ratingChange: ratingChanges.get(match.id) ?? 0,
        createdAt: match.completedAt,
      };
    });
}

export function sanitizeUser(user: StoredUser): PublicUser {
  return toPublicUser(user);
}



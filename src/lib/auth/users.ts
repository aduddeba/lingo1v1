import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getFirebaseAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import type { MatchCompletionReason, PublicUser } from '@/types';

export interface StoredUser extends PublicUser {
  passwordHash?: string;
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
  roundsPlayed?: number;
  completionReason?: MatchCompletionReason;
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

export interface PublicCompetitiveStanding {
  rank: number | null;
  totalRankedUsers: number;
  percentile: number | null;
  topPercent: number | null;
}

export interface PublicLeaderboardEntry {
  rank: number;
  username: string;
  eloRating: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winPercentage: number;
  percentile: number;
  topPercent: number;
  isCurrentUser: boolean;
}

export interface PublicLeaderboardCurrentUser {
  rank: number | null;
  username: string;
  eloRating: number;
  percentile: number | null;
  topPercent: number | null;
  totalRankedUsers: number;
}

export interface PublicLeaderboardPage {
  entries: PublicLeaderboardEntry[];
  page: number;
  pageSize: number;
  totalRankedUsers: number;
  totalPages: number;
  currentUser: PublicLeaderboardCurrentUser | null;
}

export interface UserDatabase {
  users: StoredUser[];
  matches: StoredMatchResult[];
  ratingHistory: StoredRatingHistoryEntry[];
}

let transactionQueue = Promise.resolve();

const USERS_COLLECTION = 'users';
const MATCHES_COLLECTION = 'matches';
const RATING_HISTORY_COLLECTION = 'ratingHistory';

function shouldUseFirestorePersistence(): boolean {
  return process.env['LINGO_AUTH_STORE'] !== 'json' && isFirebaseAdminConfigured();
}

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

async function readJsonDatabase(): Promise<UserDatabase> {
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

async function readDatabase(): Promise<UserDatabase> {
  if (shouldUseFirestorePersistence()) return readFirestoreDatabase();
  return readJsonDatabase();
}

async function writeDatabase(database: UserDatabase): Promise<void> {
  if (shouldUseFirestorePersistence()) {
    await writeFirestoreDatabase(database);
    return;
  }

  const filePath = dataFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempPath, JSON.stringify(database, null, 2), 'utf8');
  await rename(tempPath, filePath);
}

function snapshotData<T extends { id: string }>(snapshot: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snapshot.id, ...snapshot.data() } as T;
}

async function readFirestoreDatabase(): Promise<UserDatabase> {
  const db = getFirebaseAdminDb();
  const [users, matches, ratingHistory] = await Promise.all([
    db.collection(USERS_COLLECTION).get(),
    db.collection(MATCHES_COLLECTION).get(),
    db.collection(RATING_HISTORY_COLLECTION).get(),
  ]);

  return {
    users: users.docs.map((doc) => snapshotData<StoredUser>(doc)),
    matches: matches.docs.map((doc) => snapshotData<StoredMatchResult>(doc)),
    ratingHistory: ratingHistory.docs.map((doc) => snapshotData<StoredRatingHistoryEntry>(doc)),
  };
}

function withoutUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
  ) as Partial<T>;
}

async function writeFirestoreDatabase(database: UserDatabase): Promise<void> {
  const db = getFirebaseAdminDb();
  const batch = db.batch();

  for (const user of database.users) {
    batch.set(db.collection(USERS_COLLECTION).doc(user.id), withoutUndefined(user));
  }

  for (const match of database.matches) {
    batch.set(db.collection(MATCHES_COLLECTION).doc(match.id), withoutUndefined(match));
  }

  for (const entry of database.ratingHistory) {
    batch.set(db.collection(RATING_HISTORY_COLLECTION).doc(entry.id), withoutUndefined(entry));
  }

  await batch.commit();
}

export async function runUserDatabaseTransaction<T>(
  callback: (database: UserDatabase) => T | Promise<T>
): Promise<T> {
  if (shouldUseFirestorePersistence()) {
    const db = getFirebaseAdminDb();

    return db.runTransaction(async (transaction) => {
      const usersRef = db.collection(USERS_COLLECTION);
      const matchesRef = db.collection(MATCHES_COLLECTION);
      const ratingHistoryRef = db.collection(RATING_HISTORY_COLLECTION);
      const [users, matches, ratingHistory] = await Promise.all([
        transaction.get(usersRef),
        transaction.get(matchesRef),
        transaction.get(ratingHistoryRef),
      ]);

      const database: UserDatabase = {
        users: users.docs.map((doc) => snapshotData<StoredUser>(doc)),
        matches: matches.docs.map((doc) => snapshotData<StoredMatchResult>(doc)),
        ratingHistory: ratingHistory.docs.map((doc) => snapshotData<StoredRatingHistoryEntry>(doc)),
      };
      const result = await callback(database);

      for (const user of database.users) {
        transaction.set(usersRef.doc(user.id), withoutUndefined(user));
      }

      for (const match of database.matches) {
        transaction.set(matchesRef.doc(match.id), withoutUndefined(match));
      }

      for (const entry of database.ratingHistory) {
        transaction.set(ratingHistoryRef.doc(entry.id), withoutUndefined(entry));
      }

      return result;
    });
  }

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
  id?: string;
  username: string;
  email: string;
  passwordHash?: string;
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
    id: input.id ?? randomUUID(),
    username,
    email,
    eloRating: 1000,
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
    createdAt: Date.now(),
  };
  if (input.passwordHash) user.passwordHash = input.passwordHash;

  database.users.push(user);
  await writeDatabase(database);
  return toPublicUser(user);
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const database = await readDatabase();
  return database.users.find((user) => user.email === normalizeEmail(email)) ?? null;
}

export async function findLegacyJsonUserByEmail(email: string): Promise<StoredUser | null> {
  const database = await readJsonDatabase();
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

export async function importLegacyJsonUserData(userId: string): Promise<PublicUser | null> {
  const legacyDatabase = await readJsonDatabase();
  const legacyUser = legacyDatabase.users.find((user) => user.id === userId);
  if (!legacyUser) return null;

  return runUserDatabaseTransaction((database) => {
    const existingUser = database.users.find((user) => user.id === legacyUser.id);
    if (!existingUser) {
      const importedUser: StoredUser = {
        id: legacyUser.id,
        username: legacyUser.username,
        email: normalizeEmail(legacyUser.email),
        eloRating: legacyUser.eloRating,
        wins: legacyUser.wins,
        losses: legacyUser.losses,
        gamesPlayed: legacyUser.gamesPlayed,
        createdAt: legacyUser.createdAt,
      };
      database.users.push(importedUser);
    }

    const matchIds = new Set(database.matches.map((match) => match.id));
    for (const match of legacyDatabase.matches) {
      if (
        !matchIds.has(match.id) &&
        (match.player1Id === legacyUser.id || match.player2Id === legacyUser.id)
      ) {
        database.matches.push(match);
        matchIds.add(match.id);
      }
    }

    const historyIds = new Set(database.ratingHistory.map((entry) => entry.id));
    for (const entry of legacyDatabase.ratingHistory) {
      if (!historyIds.has(entry.id) && entry.userId === legacyUser.id) {
        database.ratingHistory.push(entry);
        historyIds.add(entry.id);
      }
    }

    return toPublicUser(existingUser ?? legacyUser);
  });
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

export async function getCompetitiveStandingForUser(
  userId: string
): Promise<PublicCompetitiveStanding> {
  const database = await readDatabase();
  const rankedUserIds = getRankedUserIds(database);
  const rankedUsers = getRankedUsers(database);
  const totalRankedUsers = rankedUsers.length;

  if (totalRankedUsers === 0 || !rankedUserIds.has(userId)) {
    return {
      rank: null,
      totalRankedUsers,
      percentile: null,
      topPercent: null,
    };
  }

  const standing = getCompetitiveStandingFromRankedUsers(rankedUsers, userId);
  if (!standing) {
    return {
      rank: null,
      totalRankedUsers,
      percentile: null,
      topPercent: null,
    };
  }

  return {
    rank: standing.rank,
    totalRankedUsers,
    percentile: standing.percentile,
    topPercent: standing.topPercent,
  };
}

export async function getLeaderboardPage(input: {
  page?: number;
  pageSize?: number;
  currentUserId?: string | null;
}): Promise<PublicLeaderboardPage> {
  const database = await readDatabase();
  const rankedUsers = getRankedUsers(database).sort(compareCompetitiveUsers);
  const totalRankedUsers = rankedUsers.length;
  const pageSize = normalizeLeaderboardPageSize(input.pageSize);
  const totalPages = Math.ceil(totalRankedUsers / pageSize);
  const requestedPage = normalizeLeaderboardPage(input.page);
  const page = totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);
  const start = (page - 1) * pageSize;
  const entries = rankedUsers.slice(start, start + pageSize).map((user, index) =>
    toLeaderboardEntry(user, rankedUsers, start + index + 1, input.currentUserId ?? null)
  );

  const currentUser = input.currentUserId
    ? toLeaderboardCurrentUser(database.users, rankedUsers, input.currentUserId)
    : null;

  return {
    entries,
    page,
    pageSize,
    totalRankedUsers,
    totalPages,
    currentUser,
  };
}

export function compareCompetitiveUsers(a: StoredUser, b: StoredUser): number {
  return (
    b.eloRating - a.eloRating ||
    b.wins - a.wins ||
    a.gamesPlayed - b.gamesPlayed ||
    a.username.localeCompare(b.username) ||
    a.id.localeCompare(b.id)
  );
}

function getRankedUserIds(database: UserDatabase): Set<string> {
  return new Set(database.ratingHistory.map((entry) => entry.userId));
}

function getRankedUsers(database: UserDatabase): StoredUser[] {
  const rankedUserIds = getRankedUserIds(database);
  return database.users.filter((user) => rankedUserIds.has(user.id));
}

function getCompetitiveStandingFromRankedUsers(
  rankedUsers: StoredUser[],
  userId: string
): { rank: number; percentile: number; topPercent: number } | null {
  const sortedUsers = [...rankedUsers].sort(compareCompetitiveUsers);
  const rank = sortedUsers.findIndex((user) => user.id === userId) + 1;
  const user = sortedUsers[rank - 1];
  if (!user) return null;

  return {
    rank,
    percentile: calculateEloPercentile(rankedUsers, user.eloRating),
    topPercent: Math.max(1, Math.ceil((rank / rankedUsers.length) * 100)),
  };
}

function calculateEloPercentile(rankedUsers: StoredUser[], eloRating: number): number {
  if (rankedUsers.length === 0) return 0;
  const usersAtOrBelowRating = rankedUsers.filter((user) => user.eloRating <= eloRating).length;
  return Math.round((usersAtOrBelowRating / rankedUsers.length) * 100);
}

function normalizeLeaderboardPage(page?: number): number {
  return Number.isInteger(page) && page && page > 0 ? page : 1;
}

function normalizeLeaderboardPageSize(pageSize?: number): number {
  if (!Number.isInteger(pageSize) || !pageSize || pageSize <= 0) return 25;
  return Math.min(pageSize, 25);
}

function toLeaderboardEntry(
  user: StoredUser,
  rankedUsers: StoredUser[],
  rank: number,
  currentUserId: string | null
): PublicLeaderboardEntry {
  const decidedGames = user.wins + user.losses;

  return {
    rank,
    username: user.username,
    eloRating: user.eloRating,
    wins: user.wins,
    losses: user.losses,
    gamesPlayed: user.gamesPlayed,
    winPercentage: decidedGames === 0 ? 0 : Math.round((user.wins / decidedGames) * 100),
    percentile: calculateEloPercentile(rankedUsers, user.eloRating),
    topPercent: Math.max(1, Math.ceil((rank / rankedUsers.length) * 100)),
    isCurrentUser: currentUserId === user.id,
  };
}

function toLeaderboardCurrentUser(
  users: StoredUser[],
  rankedUsers: StoredUser[],
  currentUserId: string
): PublicLeaderboardCurrentUser | null {
  const user = users.find((candidate) => candidate.id === currentUserId);
  if (!user) return null;

  const standing = getCompetitiveStandingFromRankedUsers(rankedUsers, currentUserId);

  return {
    rank: standing?.rank ?? null,
    username: user.username,
    eloRating: user.eloRating,
    percentile: standing?.percentile ?? null,
    topPercent: standing?.topPercent ?? null,
    totalRankedUsers: rankedUsers.length,
  };
}

export function sanitizeUser(user: StoredUser): PublicUser {
  return toPublicUser(user);
}



import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { PublicUser } from '@/types';

export interface StoredUser extends PublicUser {
  passwordHash: string;
}

interface UserDatabase {
  users: StoredUser[];
}

function dataFilePath(): string {
  const dataDir = process.env['LINGO_DATA_DIR'] ?? path.join(process.cwd(), 'data');
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
    return { users: Array.isArray(parsed.users) ? parsed.users : [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { users: [] };
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

export function sanitizeUser(user: StoredUser): PublicUser {
  return toPublicUser(user);
}



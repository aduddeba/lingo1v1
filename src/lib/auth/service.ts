import { MIN_PASSWORD_LENGTH } from './constants';
import { hashPassword, verifyPassword } from './password';
import { createSessionToken, verifyFirebaseSessionCookie, verifySessionToken } from './session';
import {
  createUser,
  findLegacyJsonUserByEmail,
  findUserByEmail,
  getPublicUserById,
  importLegacyJsonUserData,
  sanitizeUser,
} from './users';
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import type { AuthSession, PublicUser } from '@/types';

export interface AuthResult {
  user: PublicUser;
  token: string;
}

export type AuthFailureCode =
  | 'INVALID_INPUT'
  | 'EMAIL_TAKEN'
  | 'USERNAME_TAKEN'
  | 'INVALID_CREDENTIALS';

export class AuthError extends Error {
  constructor(public readonly code: AuthFailureCode, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertSignupInput(username: string, email: string, password: string): void {
  if (username.trim().length < 2 || username.trim().length > 20) {
    throw new AuthError('INVALID_INPUT', 'Username must be 2-20 characters.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new AuthError('INVALID_INPUT', 'Enter a valid email address.');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AuthError('INVALID_INPUT', `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
}

function issueAuthResult(user: PublicUser): AuthResult {
  return {
    user,
    token: createSessionToken({ userId: user.id, username: user.username, email: user.email }),
  };
}

function usernameFromFirebaseUser(input: { uid: string; name?: string; email?: string }): string {
  const base =
    input.name?.trim() ||
    input.email
      ?.split('@')[0]
      ?.replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 16) ||
    'player';
  return `${base.slice(0, 16)}${input.uid.slice(0, 4)}`.slice(0, 20);
}

async function verifyFirebaseIdToken(idToken: string): Promise<{
  uid: string;
  email: string;
  name?: string;
}> {
  if (!idToken) throw new AuthError('INVALID_INPUT', 'Firebase ID token is required.');

  try {
    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
    const email = typeof decoded.email === 'string' ? decoded.email : '';
    if (!email) throw new AuthError('INVALID_INPUT', 'Firebase account must have an email address.');
    return {
      uid: decoded.uid,
      email,
      name: typeof decoded.name === 'string' ? decoded.name : undefined,
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid or expired Firebase sign-in.');
  }
}

async function ensureFirebaseAuthUser(input: {
  uid: string;
  email: string;
  password: string;
  username: string;
}): Promise<void> {
  const auth = getFirebaseAdminAuth();

  try {
    await auth.updateUser(input.uid, {
      email: input.email,
      password: input.password,
      displayName: input.username,
    });
    return;
  } catch {
    // Missing legacy users are expected during the first login after Firebase
    // is enabled. If the uid exists under a different error shape, createUser
    // below will surface the real Firebase error.
  }

  try {
    const existingByEmail = await auth.getUserByEmail(input.email);
    await auth.updateUser(existingByEmail.uid, {
      password: input.password,
      displayName: input.username,
    });
    return;
  } catch {
    await auth.createUser({
      uid: input.uid,
      email: input.email,
      password: input.password,
      displayName: input.username,
    });
  }
}

async function loginWithLegacyJsonPassword(input: {
  email: string;
  password: string;
}): Promise<AuthResult | null> {
  const email = normalizeEmail(input.email);
  const legacyUser = await findLegacyJsonUserByEmail(email);
  if (!legacyUser?.passwordHash || !(await verifyPassword(input.password, legacyUser.passwordHash))) {
    return null;
  }

  await ensureFirebaseAuthUser({
    uid: legacyUser.id,
    email,
    password: input.password,
    username: legacyUser.username,
  });

  const user = await importLegacyJsonUserData(legacyUser.id);
  if (!user) return null;

  return issueAuthResult(user);
}

export async function signup(input: {
  username: string;
  email?: string;
  password?: string;
  idToken?: string;
}): Promise<AuthResult> {
  const username = input.username.trim();

  if (input.idToken || isFirebaseAdminConfigured()) {
    const firebaseUser = await verifyFirebaseIdToken(input.idToken ?? '');
    const email = normalizeEmail(firebaseUser.email);

    if (username.length < 2 || username.length > 20) {
      throw new AuthError('INVALID_INPUT', 'Username must be 2-20 characters.');
    }

    try {
      const user = await createUser({ id: firebaseUser.uid, username, email });
      return { user, token: input.idToken ?? '' };
    } catch (error) {
      if (error instanceof Error && (error.message === 'EMAIL_TAKEN' || error.message === 'USERNAME_TAKEN')) {
        throw new AuthError(error.message, error.message === 'EMAIL_TAKEN' ? 'An account with that email already exists.' : 'That username is already taken.');
      }
      throw error;
    }
  }

  const email = normalizeEmail(input.email ?? '');
  const password = input.password ?? '';
  assertSignupInput(username, email, password);

  try {
    const passwordHash = await hashPassword(password);
    const user = await createUser({ username, email, passwordHash });
    return issueAuthResult(user);
  } catch (error) {
    if (error instanceof Error && (error.message === 'EMAIL_TAKEN' || error.message === 'USERNAME_TAKEN')) {
      throw new AuthError(error.message, error.message === 'EMAIL_TAKEN' ? 'An account with that email already exists.' : 'That username is already taken.');
    }
    throw error;
  }
}

export async function login(input: { idToken?: string; email?: string; password?: string }): Promise<AuthResult> {
  if (input.idToken) {
    const firebaseUser = await verifyFirebaseIdToken(input.idToken ?? '');
    const existing = await getPublicUserById(firebaseUser.uid);
    if (existing) return { user: existing, token: input.idToken ?? '' };

    const user = await createUser({
      id: firebaseUser.uid,
      username: usernameFromFirebaseUser(firebaseUser),
      email: firebaseUser.email,
    });
    return { user, token: input.idToken ?? '' };
  }

  if (isFirebaseAdminConfigured() && input.email && input.password) {
    const legacyResult = await loginWithLegacyJsonPassword({
      email: input.email,
      password: input.password,
    });
    if (legacyResult) return legacyResult;
  }

  const email = normalizeEmail(input.email ?? '');
  if (!email || !input.password) {
    throw new AuthError('INVALID_INPUT', 'Email and password are required.');
  }

  const user = await findUserByEmail(email);
  if (!user?.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  return issueAuthResult(sanitizeUser(user));
}

export async function sessionFromToken(token: string | undefined | null): Promise<AuthSession | null> {
  const claims =
    (isFirebaseAdminConfigured() ? await verifyFirebaseSessionCookie(token) : null) ??
    verifySessionToken(token);
  if (!claims) return null;

  const user = await getPublicUserById(claims.sub);
  return user ? { user } : null;
}

export async function getOwnUserFromToken(
  token: string | undefined | null,
  requestedUserId: string
): Promise<{ status: 200; user: PublicUser } | { status: 401 | 403 | 404; error: string }> {
  const session = await sessionFromToken(token);
  if (!session) return { status: 401, error: 'Authentication required.' };

  if (session.user.id !== requestedUserId) {
    return { status: 403, error: 'You can only access your own user record.' };
  }

  const user = await getPublicUserById(requestedUserId);
  if (!user) return { status: 404, error: 'User not found.' };

  return { status: 200, user };
}

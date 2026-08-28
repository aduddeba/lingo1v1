import { MIN_PASSWORD_LENGTH } from './constants';
import { hashPassword, verifyPassword } from './password';
import { createSessionToken, verifySessionToken } from './session';
import { createUser, findUserByEmail, getPublicUserById, sanitizeUser } from './users';
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

export async function signup(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const username = input.username.trim();
  const email = normalizeEmail(input.email);
  assertSignupInput(username, email, input.password);

  try {
    const passwordHash = await hashPassword(input.password);
    const user = await createUser({ username, email, passwordHash });
    return issueAuthResult(user);
  } catch (error) {
    if (error instanceof Error && (error.message === 'EMAIL_TAKEN' || error.message === 'USERNAME_TAKEN')) {
      throw new AuthError(error.message, error.message === 'EMAIL_TAKEN' ? 'An account with that email already exists.' : 'That username is already taken.');
    }
    throw error;
  }
}

export async function login(input: { email: string; password: string }): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  if (!email || !input.password) {
    throw new AuthError('INVALID_INPUT', 'Email and password are required.');
  }

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  return issueAuthResult(sanitizeUser(user));
}

export async function sessionFromToken(token: string | undefined | null): Promise<AuthSession | null> {
  const claims = verifySessionToken(token);
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

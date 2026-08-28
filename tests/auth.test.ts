import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { createSocketAuthToken, verifySessionToken, verifySocketAuthToken } from '@/lib/auth/session';
import { AuthError, getOwnUserFromToken, login, sessionFromToken, signup } from '@/lib/auth/service';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'lingo-auth-test-'));
  process.env['LINGO_DATA_DIR'] = tempDir;
  process.env['AUTH_SECRET'] = 'test-secret-for-auth-suite';
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
  delete process.env['LINGO_DATA_DIR'];
  delete process.env['AUTH_SECRET'];
});

describe('authentication and persistent users', () => {
  it('creates an account with default ranked fields and no exposed password hash', async () => {
    const { user } = await signup({
      username: 'Polyglot',
      email: 'poly@example.com',
      password: 'correct horse',
    });

    assert.equal(user.username, 'Polyglot');
    assert.equal(user.email, 'poly@example.com');
    assert.equal(user.eloRating, 1000);
    assert.equal(user.wins, 0);
    assert.equal(user.losses, 0);
    assert.equal(user.gamesPlayed, 0);
    assert.equal('passwordHash' in user, false);

    const raw = await readFile(path.join(tempDir, 'users.json'), 'utf8');
    const database = JSON.parse(raw) as { users: Array<{ passwordHash: string }> };
    assert.match(database.users[0]?.passwordHash ?? '', /^scrypt:/);
    assert.notEqual(database.users[0]?.passwordHash, 'correct horse');
  });

  it('logs in with valid credentials', async () => {
    const created = await signup({
      username: 'SyntaxAce',
      email: 'syntax@example.com',
      password: 'strong passphrase',
    });

    const result = await login({ email: 'syntax@example.com', password: 'strong passphrase' });

    assert.equal(result.user.id, created.user.id);
    assert.ok(result.token);
  });

  it('rejects invalid login credentials', async () => {
    await signup({
      username: 'WrongKey',
      email: 'wrong@example.com',
      password: 'valid password',
    });

    await assert.rejects(
      login({ email: 'wrong@example.com', password: 'bad password' }),
      (error) => error instanceof AuthError && error.code === 'INVALID_CREDENTIALS'
    );
  });

  it('persists authentication through a signed session token', async () => {
    const { user, token } = await signup({
      username: 'Sessionist',
      email: 'session@example.com',
      password: 'persistent password',
    });

    const session = await sessionFromToken(token);

    assert.equal(session?.user.id, user.id);
    assert.equal(session?.user.email, 'session@example.com');
  });

  it('rejects protected user access when unauthenticated', async () => {
    const result = await getOwnUserFromToken(null, 'user-id');

    assert.equal(result.status, 401);
  });

  it('allows protected user access for the authenticated user', async () => {
    const { user, token } = await signup({
      username: 'Owner',
      email: 'owner@example.com',
      password: 'owner password',
    });

    const result = await getOwnUserFromToken(token, user.id);

    assert.equal(result.status, 200);
    if (result.status === 200) assert.equal(result.user.id, user.id);
  });

  it('creates short-lived socket tokens that are not browser session tokens', async () => {
    const { user } = await signup({
      username: 'SocketUser',
      email: 'socket@example.com',
      password: 'socket password',
    });

    const socketToken = createSocketAuthToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    assert.equal(verifySocketAuthToken(socketToken)?.sub, user.id);
    assert.equal(verifySessionToken(socketToken), null);
  });

  it('prevents users from impersonating another user id', async () => {
    const first = await signup({
      username: 'FirstUser',
      email: 'first@example.com',
      password: 'first password',
    });
    const second = await signup({
      username: 'SecondUser',
      email: 'second@example.com',
      password: 'second password',
    });

    const result = await getOwnUserFromToken(first.token, second.user.id);

    assert.equal(result.status, 403);
  });
});


import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { parseCookieHeader, verifySessionToken, verifySocketAuthToken } from '@/lib/auth/session';
import { getPublicUserById } from '@/lib/auth/users';
import type { AppSocket } from './types';
import { registerLobbyHandlers } from './matchmaking';
import { matches, socketToMatch } from './state';

const PORT = Number(process.env['PORT'] ?? 3001);
const HOST = process.env['HOST'] ?? '0.0.0.0';
const CLIENT_ORIGINS = (process.env['CLIENT_ORIGIN'] ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (CLIENT_ORIGINS.includes(origin)) return true;

  return /^http:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d{1,3}\.\d{1,3}):3000$/.test(
    origin
  );
}

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
  },
});

io.use(async (socket: AppSocket, next) => {
  const authToken =
    typeof socket.handshake.auth['token'] === 'string' ? socket.handshake.auth['token'] : undefined;
  const cookies = parseCookieHeader(socket.handshake.headers.cookie);
  const claims = verifySocketAuthToken(authToken) ?? verifySessionToken(cookies[SESSION_COOKIE_NAME]);
  if (!claims) {
    next();
    return;
  }

  const user = await getPublicUserById(claims.sub);
  if (user) {
    socket.data.authenticatedUser = user;
  }

  next();
});

io.on('connection', (socket: AppSocket) => {
  registerLobbyHandlers(io, socket);

  socket.on('answer:submit', ({ matchId, roundId, answer, pointsDelta }) => {
    const activeMatchId = socketToMatch.get(socket.id);
    if (activeMatchId !== matchId) return;
    matches.get(activeMatchId)?.submitAnswer(socket.id, roundId, answer, pointsDelta);
  });

  socket.on('match:surrender', ({ matchId }) => {
    const activeMatchId = socketToMatch.get(socket.id);
    if (activeMatchId !== matchId) return;
    matches.get(activeMatchId)?.surrender(socket.id);
  });
});

httpServer.listen(PORT, HOST, () => {
  const origins = CLIENT_ORIGINS.length ? CLIENT_ORIGINS.join(', ') : 'localhost + LAN dev origins';
  console.log(`lingo1v1 socket server listening on ${HOST}:${PORT} (client origins: ${origins})`);
});





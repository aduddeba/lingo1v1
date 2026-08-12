import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import type { AppSocket } from './types';
import { registerLobbyHandlers } from './matchmaking';
import { matches, socketToMatch } from './state';

const PORT = Number(process.env['PORT'] ?? 3001);
const CLIENT_ORIGIN = process.env['CLIENT_ORIGIN'] ?? 'http://localhost:3000';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});

io.on('connection', (socket: AppSocket) => {
  registerLobbyHandlers(io, socket);

  socket.on('answer:submit', ({ matchId, roundId, answer }) => {
    const activeMatchId = socketToMatch.get(socket.id);
    if (activeMatchId !== matchId) return;
    matches.get(activeMatchId)?.submitAnswer(socket.id, roundId, answer);
  });
});

httpServer.listen(PORT, () => {
  console.log(`lingo1v1 socket server listening on :${PORT} (client origin: ${CLIENT_ORIGIN})`);
});

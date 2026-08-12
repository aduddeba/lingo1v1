import { randomUUID } from 'node:crypto';
import type { Player } from '@/types';
import { MAX_PLAYERS_PER_MATCH } from '@/lib/constants/game';
import type { AppServer, AppSocket } from './types';
import {
  connectedPlayers,
  queues,
  pendingLobbies,
  matches,
  socketToMatch,
  type LobbyPlayer,
  type PendingLobby,
} from './state';
import { MatchSession } from './match';

const COUNTDOWN_SECONDS = 3;

function toPlayer(id: string, username: string): Player {
  return {
    id,
    username,
    avatarUrl: null,
    status: 'in_lobby',
    rating: 0,
    wins: 0,
    losses: 0,
    createdAt: Date.now(),
  };
}

export function registerLobbyHandlers(io: AppServer, socket: AppSocket): void {
  socket.on('lobby:join', ({ difficulty, player }, callback) => {
    const fullPlayer = toPlayer(player.id, player.username);
    connectedPlayers.set(socket.id, fullPlayer);
    socket.data.player = fullPlayer;

    const waiting = queues.get(difficulty);
    const waitingSocket = waiting ? io.sockets.sockets.get(waiting.socketId) : undefined;

    // No one waiting (or the waiting entry went stale because that socket
    // disconnected without cleanup) — start a fresh wait.
    if (!waiting || !waitingSocket) {
      queues.set(difficulty, { socketId: socket.id, player: fullPlayer });
      socket.data.queueDifficulty = difficulty;
      io.to(socket.id).emit('lobby:update', {
        players: [fullPlayer],
        readyCount: 0,
        maxPlayers: MAX_PLAYERS_PER_MATCH,
      });
      callback(null);
      return;
    }

    // Already the one waiting (e.g. duplicate join) — no-op.
    if (waiting.socketId === socket.id) {
      callback(null);
      return;
    }

    // Pair up. The lobby id becomes the matchId later — both sockets are
    // already members of that Socket.IO room by the time the match starts.
    queues.delete(difficulty);
    const lobbyId = randomUUID();

    socket.data.lobbyId = lobbyId;
    socket.join(lobbyId);
    waitingSocket.data.lobbyId = lobbyId;
    waitingSocket.join(lobbyId);

    const players: [LobbyPlayer, LobbyPlayer] = [
      waiting,
      { socketId: socket.id, player: fullPlayer },
    ];

    pendingLobbies.set(lobbyId, {
      difficulty,
      players,
      ready: new Set<string>(),
      countdownTimeout: null,
    });

    io.to(lobbyId).emit('lobby:update', {
      players: players.map((p) => p.player),
      readyCount: 0,
      maxPlayers: MAX_PLAYERS_PER_MATCH,
    });
    callback(null);
  });

  socket.on('lobby:ready', ({ ready }) => {
    const lobbyId = socket.data.lobbyId;
    const player = socket.data.player;
    if (!lobbyId || !player) return;
    const pending = pendingLobbies.get(lobbyId);
    if (!pending) return;

    if (ready) pending.ready.add(player.id);
    else pending.ready.delete(player.id);

    io.to(lobbyId).emit('lobby:update', {
      players: pending.players.map((p) => p.player),
      readyCount: pending.ready.size,
      maxPlayers: MAX_PLAYERS_PER_MATCH,
    });

    if (pending.ready.size === pending.players.length && !pending.countdownTimeout) {
      startCountdown(io, lobbyId, pending);
    } else if (pending.ready.size < pending.players.length && pending.countdownTimeout) {
      clearTimeout(pending.countdownTimeout);
      pending.countdownTimeout = null;
    }
  });

  socket.on('lobby:leave', () => leaveLobbyOrQueue(io, socket));

  socket.on('disconnect', () => {
    leaveLobbyOrQueue(io, socket);

    const matchId = socketToMatch.get(socket.id);
    if (matchId) matches.get(matchId)?.forfeit(socket.id);

    connectedPlayers.delete(socket.id);
  });
}

function startCountdown(io: AppServer, lobbyId: string, pending: PendingLobby): void {
  const tick = (secondsLeft: number): void => {
    if (secondsLeft <= 0) {
      pending.countdownTimeout = null;
      pendingLobbies.delete(lobbyId);

      const session = new MatchSession(io, lobbyId, pending.difficulty, pending.players);
      matches.set(lobbyId, session);
      for (const { socketId } of pending.players) socketToMatch.set(socketId, lobbyId);
      session.start();
      return;
    }

    io.to(lobbyId).emit('lobby:countdown', { startsIn: secondsLeft });
    pending.countdownTimeout = setTimeout(() => tick(secondsLeft - 1), 1_000);
  };

  tick(COUNTDOWN_SECONDS);
}

function leaveLobbyOrQueue(io: AppServer, socket: AppSocket): void {
  const queuedDifficulty = socket.data.queueDifficulty;
  if (queuedDifficulty) {
    const waiting = queues.get(queuedDifficulty);
    if (waiting?.socketId === socket.id) queues.delete(queuedDifficulty);
    socket.data.queueDifficulty = undefined;
  }

  const lobbyId = socket.data.lobbyId;
  if (lobbyId) {
    const pending = pendingLobbies.get(lobbyId);
    if (pending) {
      if (pending.countdownTimeout) clearTimeout(pending.countdownTimeout);
      pendingLobbies.delete(lobbyId);

      const remaining = pending.players.find((p) => p.socketId !== socket.id);
      if (remaining) {
        io.to(remaining.socketId).emit('lobby:player_left', {
          playerId: socket.data.player?.id ?? '',
        });
      }
    }
    socket.leave(lobbyId);
    socket.data.lobbyId = undefined;
  }
}

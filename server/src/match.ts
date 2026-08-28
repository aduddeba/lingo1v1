import type { Match, PlayerScore, Difficulty } from '@/types';
import type { AppServer } from './types';
import { buildMixedQuestionSet, type ServerQuestion } from './questions';
import { matches, socketToMatch, type LobbyPlayer } from './state';

// Delay between a round ending (reveal) and the next round starting, so both
// players can see the correct answer - mirrors the 2s auto-clear timeout the
// client already applies to `lastAnswerResult` in useGame.ts.
const REVEAL_DELAY_MS = 2_000;
const TICK_INTERVAL_MS = 1_000;

export class MatchSession {
  readonly id: string;
  readonly io: AppServer;
  readonly players: [LobbyPlayer, LobbyPlayer];
  readonly questions: ServerQuestion[];

  private match: Match;
  private roundIndex = -1;
  private answeredThisRound = new Set<string>();
  private tickInterval: ReturnType<typeof setInterval> | null = null;
  private roundTimeout: ReturnType<typeof setTimeout> | null = null;
  private revealTimeout: ReturnType<typeof setTimeout> | null = null;
  private ended = false;

  constructor(
    io: AppServer,
    id: string,
    difficulty: Difficulty,
    players: [LobbyPlayer, LobbyPlayer]
  ) {
    this.io = io;
    this.id = id;
    this.players = players;
    this.questions = buildMixedQuestionSet(difficulty);

    const scores: Record<string, PlayerScore> = {};
    for (const { player } of players) {
      scores[player.id] = {
        playerId: player.id,
        score: 0,
        streak: 0,
        answersCorrect: 0,
        answersTotal: 0,
      };
    }

    this.match = {
      id,
      difficulty,
      phase: 'active',
      currentRound: null,
      maxRounds: this.questions.length,
      scores,
      startedAt: Date.now(),
      finishedAt: null,
    };
  }

  private opponentOf(socketId: string): LobbyPlayer {
    const [a, b] = this.players;
    return a.socketId === socketId ? b : a;
  }

  private currentQuestion(): ServerQuestion | undefined {
    return this.questions[this.roundIndex];
  }

  start(): void {
    this.beginRound(0);
    // match:start carries the first round already active, since the lobby's
    // own countdown already covered the "get ready" beat.
    for (const { socketId, player } of this.players) {
      this.io.to(socketId).emit('match:start', {
        match: this.match,
        localPlayerId: player.id,
      });
    }
  }

  private beginRound(index: number): void {
    const question = this.questions[index];
    if (!question) {
      this.finish();
      return;
    }

    this.roundIndex = index;
    this.answeredThisRound.clear();

    const startedAt = Date.now();
    this.match.currentRound = {
      id: question.id,
      number: index + 1,
      mode: question.mode,
      prompt: question.prompt,
      timeLimit: question.timeLimitMs,
      startedAt,
      endsAt: startedAt + question.timeLimitMs,
      ...(question.options ? { options: question.options } : {}),
    };

    this.io.to(this.id).emit('round:start', { round: this.match.currentRound });

    this.tickInterval = setInterval(() => {
      const round = this.match.currentRound;
      if (!round?.endsAt) return;
      const timeRemaining = Math.max(0, round.endsAt - Date.now());
      this.io.to(this.id).emit('round:tick', { timeRemaining });
    }, TICK_INTERVAL_MS);

    this.roundTimeout = setTimeout(() => this.endRound(), question.timeLimitMs);
  }

  private endRound(): void {
    if (this.tickInterval) clearInterval(this.tickInterval);
    if (this.roundTimeout) clearTimeout(this.roundTimeout);
    this.tickInterval = null;
    this.roundTimeout = null;

    const round = this.match.currentRound;
    const question = this.currentQuestion();
    if (!round || !question) return;

    this.io.to(this.id).emit('round:end', {
      round,
      scores: this.match.scores,
      correctAnswer: question.correctAnswer,
    });

    const isLastRound = this.roundIndex + 1 >= this.questions.length;
    this.revealTimeout = setTimeout(() => {
      if (isLastRound) {
        this.finish();
      } else {
        this.beginRound(this.roundIndex + 1);
      }
    }, REVEAL_DELAY_MS);
  }

  submitAnswer(socketId: string, roundId: string, answer: string): void {
    if (this.ended) return;
    const round = this.match.currentRound;
    const question = this.currentQuestion();
    if (!round || !question || round.id !== roundId) return;

    const entry = this.players.find((p) => p.socketId === socketId);
    if (!entry) return;
    const { player } = entry;
    if (this.answeredThisRound.has(player.id)) return;

    this.answeredThisRound.add(player.id);

    const score = this.match.scores[player.id];
    if (!score) return;

    const timeRemaining = Math.max(0, (round.endsAt ?? Date.now()) - Date.now());
    const correct = question.isCorrect(answer);
    const newStreak = correct ? score.streak + 1 : 0;
    const pointsDelta = question.score(correct, timeRemaining, newStreak);

    score.score += pointsDelta;
    score.streak = newStreak;
    score.answersTotal += 1;
    if (correct) score.answersCorrect += 1;

    this.io.to(socketId).emit('answer:result', {
      correct,
      pointsDelta,
      newScore: score.score,
      newStreak,
      correctAnswer: question.correctAnswer,
    });
    this.io.to(this.id).emit('score:update', { scores: this.match.scores });

    if (this.answeredThisRound.size === this.players.length) {
      this.endRound();
    }
  }

  // Ends the match immediately because `disconnectedSocketId` left; the
  // other player wins by forfeit.
  forfeit(disconnectedSocketId: string): void {
    this.finishAsLoss(disconnectedSocketId, 'forfeit');
  }

  surrender(surrenderingSocketId: string): void {
    this.finishAsLoss(surrenderingSocketId, 'surrender');
  }

  private finishAsLoss(losingSocketId: string, reason: 'forfeit' | 'surrender'): void {
    if (this.ended) return;
    const winner = this.opponentOf(losingSocketId);
    this.finish(winner.player.id, reason);
  }

  private finish(winnerIdOverride?: string, reason: 'completed' | 'forfeit' | 'surrender' = 'completed'): void {
    if (this.ended) return;
    this.ended = true;
    this.clearTimers();

    this.match.phase = 'game_over';
    this.match.finishedAt = Date.now();

    const winnerId = winnerIdOverride ?? this.computeWinner();
    this.io.to(this.id).emit('match:end', { match: this.match, winnerId, reason });

    for (const { socketId } of this.players) socketToMatch.delete(socketId);
    matches.delete(this.id);
  }

  private computeWinner(): string | null {
    const [a, b] = this.players;
    const scoreA = this.match.scores[a.player.id]?.score ?? 0;
    const scoreB = this.match.scores[b.player.id]?.score ?? 0;
    if (scoreA === scoreB) return null;
    return scoreA > scoreB ? a.player.id : b.player.id;
  }

  private clearTimers(): void {
    if (this.tickInterval) clearInterval(this.tickInterval);
    if (this.roundTimeout) clearTimeout(this.roundTimeout);
    if (this.revealTimeout) clearTimeout(this.revealTimeout);
    this.tickInterval = null;
    this.roundTimeout = null;
    this.revealTimeout = null;
  }
}



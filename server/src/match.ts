import { MAX_ROUNDS_PER_MATCH, TARGET_SCORE_PER_MATCH } from '@/lib/constants/game';
import type { Match, PlayerScore, Difficulty, MatchCompletionReason } from '@/types';
import type { AppServer } from './types';
import { buildMixedQuestionSet, type ServerQuestion } from './questions';
import { matches, socketToMatch, type LobbyPlayer } from './state';
import { completeRankedMatch } from './matchResults';
import {
  evaluateMatchProgress,
  getRoundAdvanceDecision,
  type MatchProgressResult,
} from './matchCompletion';

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
  private roundEnding = false;

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
      targetScore: TARGET_SCORE_PER_MATCH,
      maxRounds: this.questions.length,
      roundsPlayed: 0,
      scores,
      startedAt: Date.now(),
      finishedAt: null,
      completionReason: null,
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
      void this.finish({
        reason: this.computeWinner() ? 'round_limit' : 'draw',
        roundsPlayed: this.match.roundsPlayed,
      });
      return;
    }

    this.roundIndex = index;
    this.answeredThisRound.clear();
    this.roundEnding = false;

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
      ...(question.questionType ? { questionType: question.questionType } : {}),
      ...(question.chain ? { chain: question.chain } : {}),
      ...(question.languageChain ? { languageChain: question.languageChain } : {}),
      ...(question.hiddenIndex !== undefined ? { hiddenIndex: question.hiddenIndex } : {}),
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
    if (this.ended || this.roundEnding) return;
    this.roundEnding = true;
    if (this.tickInterval) clearInterval(this.tickInterval);
    if (this.roundTimeout) clearTimeout(this.roundTimeout);
    this.tickInterval = null;
    this.roundTimeout = null;

    const round = this.match.currentRound;
    const question = this.currentQuestion();
    if (!round || !question) return;
    this.match.roundsPlayed = Math.max(this.match.roundsPlayed, round.number);

    this.io.to(this.id).emit('round:end', {
      round,
      scores: this.match.scores,
      correctAnswer: question.correctAnswer,
    });

    const progress = this.evaluateProgressAfterRound();
    const hasNextRound = this.roundIndex + 1 < this.questions.length;
    const advanceDecision = getRoundAdvanceDecision(progress, hasNextRound);
    this.revealTimeout = setTimeout(() => {
      if (advanceDecision === 'finish_match') {
        void this.finish({
          reason: progress.reason ?? (this.computeWinner() ? 'round_limit' : 'draw'),
          roundsPlayed: this.match.roundsPlayed,
        });
      } else {
        this.beginRound(this.roundIndex + 1);
      }
    }, REVEAL_DELAY_MS);
  }

  submitAnswer(
    socketId: string,
    roundId: string,
    answer: string,
    _clientPointsDelta?: number
  ): void {
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
    const evaluation = question.evaluate(answer);
    const newStreak = evaluation.correct ? score.streak + 1 : 0;
    const pointsDelta = question.score(evaluation, timeRemaining, newStreak);

    score.score += pointsDelta;
    score.streak = newStreak;
    score.answersTotal += 1;
    if (evaluation.correct) score.answersCorrect += 1;

    this.io.to(socketId).emit('answer:result', {
      correct: evaluation.correct,
      specificityLevel: evaluation.specificityLevel,
      specificityPoints: evaluation.specificityPoints,
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
    void this.finishAsLoss(disconnectedSocketId, 'forfeit');
  }

  surrender(surrenderingSocketId: string): void {
    void this.finishAsLoss(surrenderingSocketId, 'surrender');
  }

  private async finishAsLoss(losingSocketId: string, reason: 'forfeit' | 'surrender'): Promise<void> {
    if (this.ended) return;
    const winner = this.opponentOf(losingSocketId);
    await this.finish({
      winnerIdOverride: winner.player.id,
      reason,
      roundsPlayed: this.match.roundsPlayed,
    });
  }

  private async finish(input: {
    winnerIdOverride?: string;
    reason: MatchCompletionReason;
    roundsPlayed: number;
  }): Promise<void> {
    if (this.ended) return;
    this.ended = true;
    this.clearTimers();

    this.match.phase = 'game_over';
    this.match.finishedAt = Date.now();
    this.match.roundsPlayed = input.roundsPlayed;
    this.match.completionReason = input.reason;

    const winnerId = input.winnerIdOverride ?? this.computeWinner();
    const ratingCompletion = await completeRankedMatch({
      matchId: this.id,
      players: this.players,
      scores: this.match.scores,
      createdAt: this.match.startedAt ?? Date.now(),
      completedAt: this.match.finishedAt,
      roundsPlayed: this.match.roundsPlayed,
      completionReason: input.reason,
      outcome: input.winnerIdOverride
        ? { type: 'server_forced', winnerId: input.winnerIdOverride }
        : { type: 'score' },
    });

    for (const { socketId, authenticatedUserId } of this.players) {
      this.io.to(socketId).emit('match:end', {
        match: this.match,
        winnerId,
        reason: input.reason,
        ratingResult: authenticatedUserId ? ratingCompletion?.ratingResults[authenticatedUserId] : undefined,
      });
      socketToMatch.delete(socketId);
    }

    matches.delete(this.id);
  }

  private computeWinner(): string | null {
    const [a, b] = this.players;
    const scoreA = this.match.scores[a.player.id]?.score ?? 0;
    const scoreB = this.match.scores[b.player.id]?.score ?? 0;
    if (scoreA === scoreB) return null;
    return scoreA > scoreB ? a.player.id : b.player.id;
  }

  private evaluateProgressAfterRound(): MatchProgressResult {
    return evaluateMatchProgress({
      players: this.players,
      scores: this.match.scores,
      roundsPlayed: this.match.roundsPlayed,
      targetScore: this.match.targetScore,
      maxRounds: MAX_ROUNDS_PER_MATCH,
    });
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



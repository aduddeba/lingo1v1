import type { ScriptBlitzQuestion, ScriptBlitzConfig } from '@/types/practice';
import { SCRIPT_BLITZ_QUESTIONS } from './questions/scriptBlitz';

// ─── Timing ───────────────────────────────────────────────────────────────────

export const BLITZ_TIME_LIMIT = 30;    // seconds per question
export const BLITZ_QUESTION_LIMIT = 20; // questions per session

// ─── Scoring ──────────────────────────────────────────────────────────────────
// Pop Sauce–style linear decay: 100 pts at full time, ~0 at 0.
// Minimum 8 pts for any correct answer. Streak adds a flat bonus (capped).

export function calculateBlitzPoints(
  timeRemaining: number,
  timeLimit: number,
  streak: number
): number {
  const base = Math.max(8, Math.round((timeRemaining / timeLimit) * 100));
  const streakBonus = Math.min(50, streak * 5);
  return base + streakBonus;
}

// ─── Answer matching ──────────────────────────────────────────────────────────
// Forgiving: strips punctuation, collapses whitespace, lowercases, then checks
// the canonical answer and all registered aliases.

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9-￿]/g, '') // keep Unicode letters/digits
    .trim();
}

export function checkAnswer(input: string, question: ScriptBlitzQuestion): boolean {
  if (!input.trim()) return false;
  const n = normalize(input);
  const acceptedAnswers = question.acceptedAnswers?.map((acceptedAnswer) => acceptedAnswer.value) ?? [
    question.answer,
    ...question.aliases,
  ];
  return acceptedAnswers.some((answer) => normalize(answer) === n);
}

// ─── Question selection ───────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

export function buildBlitzPool(config: ScriptBlitzConfig): ScriptBlitzQuestion[] {
  let pool = SCRIPT_BLITZ_QUESTIONS;

  // Category filter
  if (config.category !== 'mixed') {
    pool = pool.filter((q) => q.category === config.category);
  }

  // Difficulty filter
  if (config.difficulty !== 'mixed') {
    const filtered = pool.filter((q) => q.difficulty === config.difficulty);
    pool = filtered.length > 0 ? filtered : pool;
  }

  return shuffle(pool);
}

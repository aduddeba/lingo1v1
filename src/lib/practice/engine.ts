import type { PracticeQuestion, PracticeConfig } from '@/types/practice';
import { HISTORICAL_EVOLUTION_QUESTIONS } from './questions/historicalEvolution';
import { LANGUAGE_ANCESTRY_QUESTIONS } from './questions/languageAncestry';

// ─── Time limits per difficulty (seconds) ────────────────────────────────────

export const TIME_LIMITS: Record<1 | 2 | 3, number> = {
  1: 20,
  2: 15,
  3: 12,
};

// ─── Shuffle ─────────────────────────────────────────────────────────────────

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = result[i];
    const b = result[j];
    if (a !== undefined && b !== undefined) {
      result[i] = b;
      result[j] = a;
    }
  }
  return result;
}

// ─── Scoring ─────────────────────────────────────────────────────────────────
// base = 100 × difficulty
// speed bonus = up to 50 × difficulty (proportional to time remaining)
// streak multiplier applied after: ×1.25 at 3+, ×1.5 at 5+, ×2.0 at 7+

export function calculatePoints(
  correct: boolean,
  timeRemaining: number,
  timeLimit: number,
  newStreak: number,
  difficulty: 1 | 2 | 3
): number {
  if (!correct) return 0;

  const base = 100 * difficulty;
  const speedBonus = Math.floor((timeRemaining / timeLimit) * 50 * difficulty);
  const streakMultiplier =
    newStreak >= 7 ? 2.0 : newStreak >= 5 ? 1.5 : newStreak >= 3 ? 1.25 : 1.0;

  return Math.round((base + speedBonus) * streakMultiplier);
}

// ─── Question selection ───────────────────────────────────────────────────────
// Draws from both word-form and language-ancestry banks, interleaved.
// For 'mixed': returns an even split of each difficulty, easier questions first.
// For a single difficulty: returns shuffled questions of that difficulty.
// Options within every question are shuffled so repeat plays feel different.

export function selectQuestions(config: PracticeConfig): PracticeQuestion[] {
  const bank: PracticeQuestion[] = shuffle([
    ...HISTORICAL_EVOLUTION_QUESTIONS,
    ...LANGUAGE_ANCESTRY_QUESTIONS,
  ]);
  const { difficulty, questionCount } = config;

  let pool: PracticeQuestion[];

  if (difficulty === 'mixed') {
    const easy   = shuffle(bank.filter((q) => q.difficulty === 1));
    const medium = shuffle(bank.filter((q) => q.difficulty === 2));
    const hard   = shuffle(bank.filter((q) => q.difficulty === 3));
    const perTier = Math.ceil(questionCount / 3);
    pool = [
      ...easy.slice(0, perTier),
      ...medium.slice(0, perTier),
      ...hard.slice(0, perTier),
    ].slice(0, questionCount);
  } else {
    const diffMap: Record<typeof difficulty, 1 | 2 | 3> = {
      easy: 1,
      medium: 2,
      hard: 3,
    } as const;
    pool = shuffle(bank.filter((q) => q.difficulty === diffMap[difficulty as Exclude<typeof difficulty, 'mixed'>]));
  }

  // Shuffle each question's options so correct answer position varies
  return pool.slice(0, questionCount).map((q) => ({
    ...q,
    options: shuffle([...q.options]),
  }));
}

// ─── Performance label ────────────────────────────────────────────────────────

export type PerformanceLabel =
  | 'Beginner'
  | 'Apprentice'
  | 'Wordsmith'
  | 'Scholar'
  | 'Etymology Master';

export function getPerformanceLabel(correctCount: number, total: number): PerformanceLabel {
  if (total === 0) return 'Beginner';
  const pct = correctCount / total;
  if (pct >= 0.9) return 'Etymology Master';
  if (pct >= 0.75) return 'Scholar';
  if (pct >= 0.6) return 'Wordsmith';
  if (pct >= 0.4) return 'Apprentice';
  return 'Beginner';
}

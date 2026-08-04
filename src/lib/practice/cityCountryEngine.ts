import type { CityCountryQuestion, CityCountryConfig } from '@/types/practice';
import { CITY_COUNTRY_QUESTIONS } from './questions/cityCountry';
import { shuffle } from './engine';

// ─── Answer matching ──────────────────────────────────────────────────────────
// Forgiving: strips punctuation, collapses whitespace, lowercases, then checks
// the canonical answer and all registered aliases.

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9-￿]/g, '') // keep Unicode letters/digits
    .trim();
}

export function checkAnswer(input: string, question: CityCountryQuestion): boolean {
  if (!input.trim()) return false;
  const n = normalize(input);
  if (n === normalize(question.answer)) return true;
  return question.aliases.some((a) => normalize(a) === n);
}

// ─── Question selection ───────────────────────────────────────────────────────
// For 'mixed': returns an even split of each difficulty, easier questions first.
// For a single difficulty: returns shuffled questions of that difficulty.

export function selectCityCountryQuestions(config: CityCountryConfig): CityCountryQuestion[] {
  const bank = shuffle(CITY_COUNTRY_QUESTIONS);
  const { difficulty, questionCount } = config;

  let pool: CityCountryQuestion[];

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

  return pool.slice(0, questionCount);
}

// ─── Performance label ────────────────────────────────────────────────────────

export type GeoPerformanceLabel =
  | 'Lost Tourist'
  | 'Backpacker'
  | 'Navigator'
  | 'Globetrotter'
  | 'World Atlas';

export function getGeoPerformanceLabel(correctCount: number, total: number): GeoPerformanceLabel {
  if (total === 0) return 'Lost Tourist';
  const pct = correctCount / total;
  if (pct >= 0.9) return 'World Atlas';
  if (pct >= 0.75) return 'Globetrotter';
  if (pct >= 0.6) return 'Navigator';
  if (pct >= 0.4) return 'Backpacker';
  return 'Lost Tourist';
}

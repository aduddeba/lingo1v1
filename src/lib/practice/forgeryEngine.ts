import type { ForgeryQuestion, ForgeryConfig } from '@/types/practice';
import { FORGERY_QUESTIONS } from './questions/forgery';
import { shuffle, calculatePoints, TIME_LIMITS } from './engine';

export { calculatePoints, TIME_LIMITS };

// ─── Regions ──────────────────────────────────────────────────────────────────

export interface ForgeryRegion {
  id: string;
  label: string;
  hint: string;
}

export const FORGERY_REGIONS: ForgeryRegion[] = [
  { id: 'europe',                label: 'Europe',                   hint: 'Spanish, French, German, Greek…' },
  { id: 'east_asia',             label: 'East Asia',                hint: 'Japanese, Korean, Chinese, Cantonese' },
  { id: 'southeast_asia',        label: 'Southeast Asia',           hint: 'Vietnamese, Indonesian, Thai' },
  { id: 'south_asia',            label: 'South Asia',               hint: 'Hindi, Bengali, Tamil, Urdu…' },
  { id: 'west_asia_north_africa', label: 'West Asia & North Africa', hint: 'Arabic, Persian, Turkish, Georgian' },
  { id: 'sub_saharan_africa',    label: 'Sub-Saharan Africa',       hint: 'Swahili, Zulu, Afrikaans…' },
];

export const ALL_REGION_IDS = FORGERY_REGIONS.map((r) => r.id);

// ─── Question selection ───────────────────────────────────────────────────────

export function selectForgeryQuestions(config: ForgeryConfig): ForgeryQuestion[] {
  const { difficulty, questionCount, regions } = config;

  // Empty regions array means all regions
  const activeRegions = regions.length > 0 ? regions : ALL_REGION_IDS;
  const byRegion = FORGERY_QUESTIONS.filter((q) => activeRegions.includes(q.region));

  let pool: ForgeryQuestion[];

  if (difficulty === 'mixed') {
    const easy   = shuffle(byRegion.filter((q) => q.difficulty === 1));
    const medium = shuffle(byRegion.filter((q) => q.difficulty === 2));
    const hard   = shuffle(byRegion.filter((q) => q.difficulty === 3));
    pool = [...easy, ...medium, ...hard];
  } else {
    const diffMap = { easy: 1, medium: 2, hard: 3 } as const;
    pool = shuffle(
      byRegion.filter(
        (q) => q.difficulty === diffMap[difficulty as Exclude<typeof difficulty, 'mixed'>]
      )
    );
    // Fallback: if no questions match difficulty in these regions, use all regional questions
    if (pool.length === 0) pool = shuffle(byRegion);
  }

  // Shuffle each question's options (real vs fake order) so position varies
  return pool.slice(0, questionCount).map((q) => ({
    ...q,
    options: shuffle([q.realText, q.fakeText]),
  }));
}

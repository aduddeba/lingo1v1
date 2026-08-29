import type { GameMode, Difficulty } from '@/types';

export const GAME_MODES: Record<GameMode, { label: string; description: string }> = {
  forgery: {
    label: 'Forgery',
    description: 'Spot the fake language before your opponent does.',
  },
  historical_evolution: {
    label: 'Historical Evolution Battles',
    description: 'Race through the history of a word across centuries.',
  },
  script_blitz: {
    label: 'Origin Blitz',
    description: 'Identify scripts, languages, and surname origins at lightning speed.',
  },
  city_country: {
    label: 'Country Finder',
    description: "Given a city, pick the country it's in before the clock runs out.",
  },
};

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; timeLimit: number; pointsMultiplier: number }
> = {
  easy: { label: 'Easy', timeLimit: 30_000, pointsMultiplier: 1 },
  medium: { label: 'Medium', timeLimit: 20_000, pointsMultiplier: 1.5 },
  hard: { label: 'Hard', timeLimit: 12_000, pointsMultiplier: 2 },
  expert: { label: 'Expert', timeLimit: 8_000, pointsMultiplier: 3 },
  mixed: { label: 'Mixed', timeLimit: 20_000, pointsMultiplier: 1.5 },
};

// Modes whose rounds carry Round.options and are answered by picking one;
// every other mode is free-text (see AnswerPanel).
export const CHOICE_BASED_MODES: readonly GameMode[] = ['forgery', 'historical_evolution'];

export const MAX_PLAYERS_PER_MATCH = 2;
export const STANDARD_MATCH_CONFIG = {
  targetScore: 3_000,
  maxRounds: 25,
} as const;
export const TARGET_SCORE_PER_MATCH = STANDARD_MATCH_CONFIG.targetScore;
export const MAX_ROUNDS_PER_MATCH = STANDARD_MATCH_CONFIG.maxRounds;
export const BASE_POINTS_PER_CORRECT = 100;
export const STREAK_BONUS_THRESHOLD = 3;
export const STREAK_BONUS_MULTIPLIER = 0.25;

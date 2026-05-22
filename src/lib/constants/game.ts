import type { GameMode, Difficulty } from '@/types';

export const GAME_MODES: Record<GameMode, { label: string; description: string }> = {
  map_sniping: {
    label: 'Map Sniping',
    description: 'Geographic linguistics — pin the language to the region.',
  },
  forgery: {
    label: 'Forgery',
    description: 'Spot the fake language before your opponent does.',
  },
  live_bidding: {
    label: 'Live Bidding',
    description: 'Wager points on each round in real time.',
  },
  language_powerups: {
    label: 'Language Power-Ups',
    description: 'Collect and deploy linguistic abilities to gain the edge.',
  },
  historical_evolution: {
    label: 'Historical Evolution Battles',
    description: 'Race through the history of a word across centuries.',
  },
  elo_specialty: {
    label: 'ELO by Linguistic Specialty',
    description: 'Climb a separate rating ladder for each language family.',
  },
  spectator_deduction: {
    label: 'Spectator Deduction',
    description: 'Observers vote on outcomes while players compete live.',
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
};

export const MAX_PLAYERS_PER_MATCH = 2;
export const MAX_ROUNDS_PER_MATCH = 10;
export const BASE_POINTS_PER_CORRECT = 100;
export const STREAK_BONUS_THRESHOLD = 3;
export const STREAK_BONUS_MULTIPLIER = 0.25;

import type { GameMode } from './game';

// ─── Chain Stage ──────────────────────────────────────────────────────────────
// One node in a linguistic ancestry chain.

export interface ChainStage {
  language: string;
  form: string;
  gloss?: string; // English gloss shown in italics, e.g. '"wind" + "eye"'
}

// ─── Word-form evolution question ─────────────────────────────────────────────
// Shows a full ancestry chain; player picks the correct word form for the
// hidden stage.
//
// Invariant: options contains answer, and answer === chain[hiddenIndex].form

export type EvolutionQuestionType =
  | 'predict_end'   // hidden stage is the final (modern English) word
  | 'fill_gap';     // hidden stage is somewhere in the middle

export interface HistoricalEvolutionQuestion {
  id: string;
  type: EvolutionQuestionType;
  targetWord: string;       // Modern English reference word (used in result screen)
  chain: ChainStage[];      // Full chain; chain[hiddenIndex] is shown as "???"
  hiddenIndex: number;
  prompt: string;
  options: string[];        // 4 word-form choices; shuffled at session init
  answer: string;           // Must match chain[hiddenIndex].form exactly
  explanation: string;
  difficulty: 1 | 2 | 3;
}

// ─── Language ancestry question ───────────────────────────────────────────────
// Shows a chain of language names (e.g. Latin → Vulgar Latin → Old French → ???)
// and the player predicts the next language in the lineage.
//
// Invariant: options contains answer, and answer === languageChain[hiddenIndex]

export interface LanguageAncestryQuestion {
  id: string;
  type: 'language_ancestry';
  languageChain: string[];  // Full chain of language names; [hiddenIndex] shown as "???"
  hiddenIndex: number;
  prompt: string;
  options: string[];        // 4 language-name choices; shuffled at session init
  answer: string;           // Must match languageChain[hiddenIndex] exactly
  explanation: string;
  difficulty: 1 | 2 | 3;
}

// Union of all question variants used in a practice session
export type PracticeQuestion = HistoricalEvolutionQuestion | LanguageAncestryQuestion;

// ─── Session Config ───────────────────────────────────────────────────────────

export type PracticeDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';
export type PracticeQuestionCount = 5 | 10 | 15 | 20;

export interface PracticeConfig {
  mode: Extract<GameMode, 'historical_evolution'>;
  difficulty: PracticeDifficulty;
  questionCount: PracticeQuestionCount;
}

// ─── Session State ────────────────────────────────────────────────────────────

export type PracticePhase = 'settings' | 'intro' | 'question' | 'feedback' | 'complete';

export interface PracticeAnswerResult {
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  correctAnswerLanguage: string; // e.g. "Old French" — for display in feedback
  explanation: string;
  targetWord: string;            // modern word (word-form) or predicted language name (ancestry)
  targetLabel: string;           // "Evolved into" (word-form) or "Language" (ancestry)
  pointsEarned: number;
  streakBonus: boolean;
}

export interface PracticeSessionStats {
  score: number;
  correctCount: number;
  totalCount: number;
  maxStreak: number;
  difficulty: PracticeDifficulty;
}

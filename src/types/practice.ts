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

// ─── Forgery question ─────────────────────────────────────────────────────────
// Shows two text samples (one real, one AI-generated fake) and the player picks
// the genuine one.
//
// Invariant: options contains [realText, fakeText] shuffled; answer === realText

export interface ForgeryQuestion {
  id: string;
  type: 'forgery';
  language: string;
  script: string;       // e.g. 'Latin', 'Cyrillic', 'Arabic' - shown as context
  region: string;       // region id, e.g. 'europe', 'south_asia'
  realText: string;
  fakeText: string;
  options: string[];    // [realText, fakeText] shuffled at session init
  answer: string;       // always === realText
  explanation: string;
  difficulty: 1 | 2 | 3;
}

// ─── Session Config ───────────────────────────────────────────────────────────

export type PracticeDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';
export type PracticeQuestionCount = 5 | 10 | 15 | 20;

export interface PracticeConfig {
  mode: Extract<GameMode, 'historical_evolution'>;
  difficulty: PracticeDifficulty;
  questionCount: PracticeQuestionCount;
}

export interface ForgeryConfig {
  mode: Extract<GameMode, 'forgery'>;
  difficulty: PracticeDifficulty;
  questionCount: PracticeQuestionCount;
  regions: string[];    // region ids; empty means all regions
}

// ─── Session State ────────────────────────────────────────────────────────────

export type PracticePhase = 'settings' | 'intro' | 'question' | 'feedback' | 'complete';

export interface PracticeAnswerResult {
  correct: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  correctAnswerLanguage: string; // e.g. "Old French" - for display in feedback
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

// ─── Forgery session result ───────────────────────────────────────────────────

export interface ForgeryAnswerResult {
  correct: boolean;
  selectedText: string;
  realText: string;
  fakeText: string;
  language: string;
  explanation: string;
  pointsEarned: number;
  streakBonus: boolean;
}

// ─── City → Country question ───────────────────────────────────────────────────
// Player sees a city name and types which country it's in.
//
// Answer checking is forgiving: normalized against `answer` and every entry
// in `aliases` (abbreviations, alternate spellings, etc).

export interface CityCountryQuestion {
  id: string;
  type: 'city_country';
  city: string;          // e.g. "Porto"
  continent: string;     // e.g. "Europe" - shown in feedback alongside the answer
  prompt: string;        // e.g. "Which country is Porto in?"
  answer: string;        // the correct country, canonical form
  aliases: string[];     // accepted alternate spellings/abbreviations (e.g. "USA", "UK")
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface CityCountryConfig {
  mode: Extract<GameMode, 'city_country'>;
  difficulty: PracticeDifficulty;
  questionCount: PracticeQuestionCount;
}

// ─── Script Blitz question ────────────────────────────────────────────────────
// Player sees displayText in a script and must type the script or language name.
// type 'script': answer is the writing system (e.g. "Cyrillic", "Hangul")
// type 'language': answer is the language (e.g. "Finnish", "Welsh")

export interface ScriptBlitzQuestion {
  id: string;
  category: 'script' | 'language' | 'surname';
  displayText: string;
  answer: string;
  aliases: string[];      // alternate accepted forms (including all valid countries for surname questions)
  hint: string;           // shown after timeout
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ScriptBlitzConfig {
  mode: Extract<GameMode, 'script_blitz'>;
  category: 'script' | 'language' | 'surname' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

export interface ScriptBlitzAnswerResult {
  questionId: string;
  displayText: string;
  correct: boolean;
  skipped: boolean;
  timedOut: boolean;
  typedAnswer: string;
  correctAnswer: string;
  pointsEarned: number;
  streakBonus: boolean;
  timeRemaining: number;
}

export interface ScriptBlitzSessionStats {
  score: number;
  correctCount: number;
  totalAnswered: number;
  maxStreak: number;
}

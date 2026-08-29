import type { GameMode, Difficulty } from '@/types';
import type { PracticeDifficulty, PracticeQuestionCount, PracticeQuestion } from '@/types/practice';
import { selectQuestions, calculatePoints, TIME_LIMITS, shuffle } from '@/lib/practice/engine';
import { selectForgeryQuestions } from '@/lib/practice/forgeryEngine';
import { selectCityCountryQuestions } from '@/lib/practice/cityCountryEngine';
import {
  buildBlitzPool,
  calculateBlitzPoints,
  BLITZ_TIME_LIMIT,
} from '@/lib/practice/scriptBlitzEngine';
import { MAX_ROUNDS_PER_MATCH } from '@/lib/constants/game';
import {
  evaluateAnswer,
  scalePointsBySpecificity,
  type AcceptedAnswer,
  type AnswerEvaluation,
} from './answerEvaluation';

const ALL_MODES: readonly GameMode[] = [
  'forgery',
  'historical_evolution',
  'city_country',
  'script_blitz',
];

// A round's worth of authoritative question data. The answer key never
// leaves this module - `isCorrect`/`score` are closures over it, and only
// `mode`/`prompt`/`options`/`timeLimitMs` are ever serialized to clients.
export interface ServerQuestion {
  id: string;
  mode: GameMode;
  prompt: string;
  options?: string[];
  timeLimitMs: number;
  correctAnswer: string;
  acceptedAnswers: AcceptedAnswer[];
  evaluate: (answer: string) => AnswerEvaluation;
  score: (evaluation: AnswerEvaluation, timeRemainingMs: number, streak: number) => number;
}

// The multiplayer picker only offers easy/medium/hard/mixed; 'expert' exists
// on the shared `Difficulty` type for the (currently unused) single-player
// Match.difficulty display but has no corresponding question tier.
function toPracticeDifficulty(difficulty: Difficulty): PracticeDifficulty {
  return difficulty === 'expert' ? 'hard' : difficulty;
}

function fromPracticeQuestion(mode: GameMode, q: PracticeQuestion): ServerQuestion {
  const timeLimitMs = TIME_LIMITS[q.difficulty] * 1000;
  const acceptedAnswers = toAcceptedAnswers(q.answer, []);
  return {
    id: q.id,
    mode,
    prompt: q.prompt,
    options: q.options,
    timeLimitMs,
    correctAnswer: q.answer,
    acceptedAnswers,
    evaluate: (answer) => evaluateAnswer(acceptedAnswers, answer),
    score: (evaluation, timeRemainingMs, streak) =>
      scalePointsBySpecificity(
        calculatePoints(evaluation.correct, timeRemainingMs, timeLimitMs, streak, q.difficulty),
        evaluation
      ),
  };
}

function toAcceptedAnswers(answer: string, aliases: readonly string[]): AcceptedAnswer[] {
  return [
    { value: answer, specificity: 'preferred' },
    ...aliases.map((alias) => ({ value: alias, specificity: 'preferred' }) as const),
  ];
}

function fromQuestionAcceptedAnswers(
  answer: string,
  aliases: readonly string[],
  acceptedAnswers?: readonly AcceptedAnswer[]
): AcceptedAnswer[] {
  return acceptedAnswers?.length ? [...acceptedAnswers] : toAcceptedAnswers(answer, aliases);
}

function buildForgeryQuestions(difficulty: Difficulty, count: number): ServerQuestion[] {
  const questions = selectForgeryQuestions({
    mode: 'forgery',
    difficulty: toPracticeDifficulty(difficulty),
    // Runtime only ever slices to this count - the 5|10|15|20 union just
    // reflects the single-player picker's UI options, not a real constraint.
    questionCount: count as PracticeQuestionCount,
    regions: [],
  });

  return questions.map((q) => {
    const timeLimitMs = TIME_LIMITS[q.difficulty] * 1000;
    const acceptedAnswers = toAcceptedAnswers(q.answer, []);
    return {
      id: q.id,
      mode: 'forgery' as const,
      prompt: `Which one is the real ${q.language} (${q.script})?`,
      options: q.options,
      timeLimitMs,
      correctAnswer: q.answer,
      acceptedAnswers,
      evaluate: (answer: string) => evaluateAnswer(acceptedAnswers, answer),
      score: (evaluation: AnswerEvaluation, timeRemainingMs: number, streak: number) =>
        scalePointsBySpecificity(
          calculatePoints(evaluation.correct, timeRemainingMs, timeLimitMs, streak, q.difficulty),
          evaluation
        ),
    };
  });
}

function buildHistoricalEvolutionQuestions(difficulty: Difficulty, count: number): ServerQuestion[] {
  const questions = selectQuestions({
    mode: 'historical_evolution',
    difficulty: toPracticeDifficulty(difficulty),
    questionCount: count as PracticeQuestionCount,
  });
  return questions.map((q) => fromPracticeQuestion('historical_evolution', q));
}

function buildCityCountryQuestions(difficulty: Difficulty, count: number): ServerQuestion[] {
  const questions = selectCityCountryQuestions({
    mode: 'city_country',
    difficulty: toPracticeDifficulty(difficulty),
    questionCount: count as PracticeQuestionCount,
  });

  return questions.map((q) => {
    const timeLimitMs = TIME_LIMITS[q.difficulty] * 1000;
    const acceptedAnswers = fromQuestionAcceptedAnswers(q.answer, q.aliases, q.acceptedAnswers);
    return {
      id: q.id,
      mode: 'city_country' as const,
      prompt: q.prompt,
      timeLimitMs,
      correctAnswer: q.answer,
      acceptedAnswers,
      evaluate: (answer: string) => evaluateAnswer(acceptedAnswers, answer),
      score: (evaluation: AnswerEvaluation, timeRemainingMs: number, streak: number) =>
        scalePointsBySpecificity(
          calculatePoints(evaluation.correct, timeRemainingMs, timeLimitMs, streak, q.difficulty),
          evaluation
        ),
    };
  });
}

function formatScriptBlitzPrompt(q: ReturnType<typeof buildBlitzPool>[number]): string {
  switch (q.category) {
    case 'script':
      return `What script is this?` + '\n' + q.displayText;
    case 'language':
      return `What language is this?` + '\n' + q.displayText;
    case 'surname':
      return `What country is this surname from?` + '\n' + q.displayText;
  }
}
function buildScriptBlitzQuestions(difficulty: Difficulty, count: number): ServerQuestion[] {
  const pool = buildBlitzPool({
    mode: 'script_blitz',
    category: 'mixed',
    difficulty: toPracticeDifficulty(difficulty),
  }).slice(0, count);
  const timeLimitMs = BLITZ_TIME_LIMIT * 1000;

  return pool.map((q) => {
    const acceptedAnswers = fromQuestionAcceptedAnswers(q.answer, q.aliases, q.acceptedAnswers);
    return {
      id: q.displayText + ':' + q.answer,
      mode: 'script_blitz' as const,
      prompt: formatScriptBlitzPrompt(q),
      timeLimitMs,
      correctAnswer: q.answer,
      acceptedAnswers,
      evaluate: (answer: string) => evaluateAnswer(acceptedAnswers, answer),
      score: (evaluation: AnswerEvaluation, timeRemainingMs: number, streak: number) =>
        scalePointsBySpecificity(
          evaluation.correct ? calculateBlitzPoints(timeRemainingMs, timeLimitMs, streak) : 0,
          evaluation
        ),
    };
  });
}

function buildQuestionsForMode(mode: GameMode, difficulty: Difficulty, count: number): ServerQuestion[] {
  if (count <= 0) return [];
  switch (mode) {
    case 'forgery':
      return buildForgeryQuestions(difficulty, count);
    case 'historical_evolution':
      return buildHistoricalEvolutionQuestions(difficulty, count);
    case 'city_country':
      return buildCityCountryQuestions(difficulty, count);
    case 'script_blitz':
      return buildScriptBlitzQuestions(difficulty, count);
  }
}

// Players only pick a difficulty (see MatchmakingSetup) - the match itself
// splits MAX_ROUNDS_PER_MATCH as evenly as possible across all 4 modes (e.g.
// 3/3/2/2 for 10 rounds, the extra rounds going to a random pair of modes
// each match), draws that many *distinct* questions from each mode's own
// bank at the chosen difficulty, then shuffles the combined set so rounds
// don't come out grouped by mode.
export function buildMixedQuestionSet(difficulty: Difficulty): ServerQuestion[] {
  const base = Math.floor(MAX_ROUNDS_PER_MATCH / ALL_MODES.length);
  const remainder = MAX_ROUNDS_PER_MATCH % ALL_MODES.length;
  const modeOrder = shuffle([...ALL_MODES]);

  const pool = modeOrder.flatMap((mode, i) =>
    buildQuestionsForMode(mode, difficulty, base + (i < remainder ? 1 : 0))
  );

  return shuffle(pool);
}

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HISTORICAL_EVOLUTION_QUESTIONS } from '@/lib/practice/questions/historicalEvolution';
import { buildMixedQuestionSet } from '../server/src/questions';
import type { Difficulty } from '@/types';

const MULTIPLAYER_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'mixed'];

describe('multiplayer question selection', () => {
  it('includes the loot historical evolution question', () => {
    const lootQuestion = HISTORICAL_EVOLUTION_QUESTIONS.find((question) => question.id === 'he-035');

    assert.equal(lootQuestion?.type, 'predict_end');
    assert.equal(lootQuestion?.targetWord, 'loot');
    assert.equal(lootQuestion?.answer, 'loot');
    assert.deepEqual(
      lootQuestion?.chain.map((stage) => stage.language),
      ['Proto-Indo-European', 'Sanskrit', 'Hindi', 'Modern English']
    );
  });

  it('includes at least one predict-end historical evolution question per match', () => {
    for (const difficulty of MULTIPLAYER_DIFFICULTIES) {
      const difficultyNumber = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      const predictEndIds = new Set(
        HISTORICAL_EVOLUTION_QUESTIONS.filter(
          (question) =>
            question.type === 'predict_end' &&
            (difficulty === 'mixed' || question.difficulty === difficultyNumber)
        ).map((question) => question.id)
      );

      const questions = buildMixedQuestionSet(difficulty);

      assert.ok(
        questions[0] && predictEndIds.has(questions[0].id),
        `${difficulty} multiplayer matches should start with a predict-end evolution question`
      );
      assert.equal(questions[0]?.mode, 'historical_evolution');
      assert.equal(questions[0]?.questionType, 'predict_end');
      assert.ok(questions[0]?.chain?.length, 'multiplayer evolution rounds should include chain data');
      assert.equal(typeof questions[0]?.hiddenIndex, 'number');
    }
  });
});

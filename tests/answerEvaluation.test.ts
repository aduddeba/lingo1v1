import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  evaluateAnswer,
  normalizeAnswer,
  scalePointsBySpecificity,
  type AcceptedAnswer,
} from '../server/src/answerEvaluation';

const acceptedAnswers: AcceptedAnswer[] = [
  { value: 'India', specificity: 'broad' },
  { value: 'Telugu', specificity: 'specific' },
  { value: 'Andhra Pradesh', specificity: 'preferred' },
  { value: 'Telangana', specificity: 'preferred' },
];

describe('answer evaluation', () => {
  it('returns incorrect for unmatched answers', () => {
    assert.deepEqual(evaluateAnswer(acceptedAnswers, 'Canada'), {
      correct: false,
      specificityLevel: 'incorrect',
      specificityPoints: 0,
    });
  });

  it('scores broad correct answers lower than precise answers', () => {
    const evaluation = evaluateAnswer(acceptedAnswers, 'India');

    assert.equal(evaluation.correct, true);
    assert.equal(evaluation.specificityLevel, 'broad');
    assert.equal(evaluation.specificityPoints, 1);
    assert.equal(scalePointsBySpecificity(300, evaluation), 100);
  });

  it('scores specific correct answers above broad answers', () => {
    const evaluation = evaluateAnswer(acceptedAnswers, 'Telugu');

    assert.equal(evaluation.correct, true);
    assert.equal(evaluation.specificityLevel, 'specific');
    assert.equal(evaluation.specificityPoints, 2);
    assert.equal(scalePointsBySpecificity(300, evaluation), 200);
  });

  it('scores most-specific preferred answers highest', () => {
    const evaluation = evaluateAnswer(acceptedAnswers, 'Telangana');

    assert.equal(evaluation.correct, true);
    assert.equal(evaluation.specificityLevel, 'preferred');
    assert.equal(evaluation.specificityPoints, 3);
    assert.equal(scalePointsBySpecificity(300, evaluation), 300);
  });

  it('normalizes capitalization differences', () => {
    assert.equal(evaluateAnswer(acceptedAnswers, 'tElAnGaNa').specificityLevel, 'preferred');
  });

  it('normalizes whitespace differences', () => {
    assert.equal(evaluateAnswer(acceptedAnswers, '  Andhra   Pradesh  ').specificityLevel, 'preferred');
  });

  it('normalizes punctuation without accepting extra irrelevant words', () => {
    assert.equal(normalizeAnswer('Andhra-Pradesh!'), 'andhra pradesh');
    assert.equal(evaluateAnswer(acceptedAnswers, 'Andhra Pradesh, India').correct, false);
  });

  it('ignores client-supplied point values by deriving points only from evaluation', () => {
    const maliciousClientPoints = 9999;
    const evaluation = evaluateAnswer(acceptedAnswers, 'India');

    assert.notEqual(scalePointsBySpecificity(300, evaluation), maliciousClientPoints);
    assert.equal(scalePointsBySpecificity(300, evaluation), 100);
  });
});

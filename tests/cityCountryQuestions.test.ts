import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { evaluateAnswer } from '../server/src/answerEvaluation';
import { CITY_COUNTRY_QUESTIONS } from '@/lib/practice/questions/cityCountry';

const REQUESTED_CITIES = new Map([
  ['Nuwara Eliya', 'Sri Lanka'],
  ['Jaffna', 'Sri Lanka'],
  ['Rajamahendravaram', 'India'],
  ['Ballari', 'India'],
  ['Barcelona', 'Spain'],
] as const);

const REGION_BONUS_ANSWERS = [
  { city: 'Rajamahendravaram', region: 'Andhra Pradesh' },
  { city: 'Ballari', region: 'Karnataka' },
  { city: 'Barcelona', region: 'Catalonia' },
] as const;

describe('City Country question bank', () => {
  it('includes the requested city questions', () => {
    for (const [city, answer] of REQUESTED_CITIES) {
      const question = CITY_COUNTRY_QUESTIONS.find((candidate) => candidate.city === city);

      assert.ok(question, `${city} should be present`);
      assert.equal(question.answer, answer);
    }
  });

  it('awards preferred specificity for requested regional answers', () => {
    for (const { city, region } of REGION_BONUS_ANSWERS) {
      const question = CITY_COUNTRY_QUESTIONS.find((candidate) => candidate.city === city);

      assert.ok(question, `${city} should be present`);
      assert.ok(question.acceptedAnswers, `${city} should use structured accepted answers`);

      const countryEvaluation = evaluateAnswer(question.acceptedAnswers, question.answer);
      const regionEvaluation = evaluateAnswer(question.acceptedAnswers, region);

      assert.equal(countryEvaluation.correct, true);
      assert.equal(countryEvaluation.specificityLevel, 'broad');
      assert.equal(regionEvaluation.correct, true);
      assert.equal(regionEvaluation.specificityLevel, 'preferred');
    }
  });
});

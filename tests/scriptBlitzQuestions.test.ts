import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SCRIPT_BLITZ_QUESTIONS } from '@/lib/practice/questions/scriptBlitz';

const REQUESTED_LANGUAGE_DIFFICULTIES = new Map([
  ['Odia', 'hard'],
  ['Marathi', 'hard'],
  ['Sanskrit', 'hard'],
  ['Latin', 'medium'],
  ['Albanian', 'medium'],
  ['Nepali', 'hard'],
  ['Uyghur', 'hard'],
  ['Uzbek', 'hard'],
  ['Kazakh', 'hard'],
  ['Kurdish', 'hard'],
  ['Lao', 'hard'],
  ['Burmese', 'hard'],
] as const);

describe('Script Blitz language question bank', () => {
  it('includes the requested languages at the requested difficulties', () => {
    for (const [language, difficulty] of REQUESTED_LANGUAGE_DIFFICULTIES) {
      const question = SCRIPT_BLITZ_QUESTIONS.find(
        (candidate) => candidate.category === 'language' && candidate.answer === language
      );

      assert.ok(question, `${language} should be present`);
      assert.equal(question.difficulty, difficulty);
      assert.ok(question.displayText.trim(), `${language} should have display text`);
      assert.ok(question.aliases.length > 0, `${language} should have aliases`);
    }
  });
});

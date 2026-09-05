import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { evaluateAnswer } from '../server/src/answerEvaluation';
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
  ['Catalan', 'medium'],
  ['Azeri', 'hard'],
  ['Lao', 'hard'],
  ['Burmese', 'hard'],
] as const);

const REQUESTED_SURNAMES = new Map([
  ['Hradecký', 'Czech Republic'],
  ['Krejčí', 'Czech Republic'],
  ['Brožek', 'Czech Republic'],
  ['Bednarek', 'Poland'],
  ['Křížek', 'Czech Republic'],
  ['Ghattamaneni', 'India'],
  ['Ibrahimović', 'Bosnia and Herzegovina'],
  ['Bajraktarević', 'Bosnia and Herzegovina'],
  ['Mehmedović', 'Bosnia and Herzegovina'],
  ['Pillai', 'India'],
  ['Thakur', 'India'],
  ['Ramasamy', 'India'],
  ['Mishra', 'India'],
  ['Jaiswal', 'India'],
  ['Ayutthaya', 'Thailand'],
  ['Ratanakorn', 'Thailand'],
  ['Giang', 'Vietnam'],
  ['Hồ', 'Vietnam'],
  ['Pan', 'China'],
  ['Zieliński', 'Poland'],
  ['Saarinen', 'Finland'],
  ['Eskelinen', 'Finland'],
  ['Jääskeläinen', 'Finland'],
  ['Hakanpää', 'Finland'],
  ['Elomo', 'Finland'],
  ['Korhonen', 'Finland'],
  ['Mäkinen', 'Finland'],
  ['Laine', 'Finland'],
  ['Niemi', 'Finland'],
  ['Aalto', 'Finland'],
  ['Csőke', 'Hungary'],
  ['Jónsdóttir', 'Iceland'],
  ['Sigurðsson', 'Iceland'],
  ['Björnsson', 'Iceland'],
  ['Þorsteinsson', 'Iceland'],
  ['Sævarsdóttir', 'Iceland'],
] as const);

const WIDELY_USED_MUSLIM_SURNAME_TEST_ANSWERS = [
  'Saudi Arabia',
  'UAE',
  'Kuwait',
  'Yemen',
  'Oman',
  'Egypt',
  'Libya',
  'Tunisia',
  'Algeria',
  'Mauritania',
  'Sudan',
  'Morocco',
] as const;

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

  it('includes the requested surnames as hard surname questions', () => {
    for (const [surname, answer] of REQUESTED_SURNAMES) {
      const question = SCRIPT_BLITZ_QUESTIONS.find(
        (candidate) => candidate.category === 'surname' && candidate.displayText === surname
      );

      assert.ok(question, `${surname} should be present`);
      assert.equal(question.answer, answer);
      assert.equal(question.difficulty, 'hard');
      assert.ok(question.aliases.length > 0, `${surname} should have aliases`);
    }
  });

  it('accepts wider Muslim-world countries for broad Muslim surnames', () => {
    for (const surname of ['Ahmed', 'Malik'] as const) {
      const question = SCRIPT_BLITZ_QUESTIONS.find(
        (candidate) => candidate.category === 'surname' && candidate.displayText === surname
      );

      assert.ok(question, `${surname} should be present`);
      assert.ok(question.acceptedAnswers, `${surname} should use structured accepted answers`);

      for (const answer of WIDELY_USED_MUSLIM_SURNAME_TEST_ANSWERS) {
        const evaluation = evaluateAnswer(question.acceptedAnswers, answer);

        assert.equal(evaluation.correct, true, `${answer} should be accepted for ${surname}`);
        assert.equal(evaluation.specificityLevel, 'broad');
      }

      assert.equal(evaluateAnswer(question.acceptedAnswers, 'Norway').correct, false);
    }
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  calculateEloMatchResult,
  calculateEloRating,
  getExpectedScore,
  getScoreMarginMultiplier,
} from '../server/src/elo';

describe('Elo rating utility', () => {
  it('updates equal Elo ratings by 16 points for a decisive result', () => {
    const result = calculateEloMatchResult(1000, 1000, 1);

    assert.equal(result.playerA.newRating, 1016);
    assert.equal(result.playerA.ratingChange, 16);
    assert.equal(result.playerB.newRating, 984);
    assert.equal(result.playerB.ratingChange, -16);
  });

  it('gives a smaller change when the favorite beats the underdog', () => {
    const result = calculateEloMatchResult(1400, 1000, 1);

    assert.equal(result.playerA.newRating, 1403);
    assert.equal(result.playerB.newRating, 997);
  });

  it('gives a larger change for an upset', () => {
    const result = calculateEloMatchResult(1400, 1000, 0);

    assert.equal(result.playerA.newRating, 1371);
    assert.equal(result.playerB.newRating, 1029);
  });

  it('supports draws when final scores are tied', () => {
    assert.equal(calculateEloRating(1000, 1000, 0.5), 1000);
    assert.equal(getExpectedScore(1000, 1000), 0.5);
  });

  it('scales rating changes down for narrow score differences', () => {
    const narrowWin = calculateEloMatchResult(1000, 1000, 1, undefined, 300);
    const normalWin = calculateEloMatchResult(1000, 1000, 1, undefined, 3000);

    assert.equal(narrowWin.playerA.ratingChange, 5);
    assert.equal(narrowWin.playerB.ratingChange, -5);
    assert.equal(normalWin.playerA.ratingChange, 16);
    assert.ok(Math.abs(narrowWin.playerA.ratingChange) < Math.abs(normalWin.playerA.ratingChange));
  });

  it('caps very large score-difference rating multipliers', () => {
    const blowout = calculateEloMatchResult(1000, 1000, 1, undefined, 12_000);

    assert.equal(blowout.playerA.ratingChange, 24);
    assert.equal(blowout.playerB.ratingChange, -24);
  });

  it('uses a minimum multiplier for tied score margins', () => {
    assert.equal(getScoreMarginMultiplier(0), 0.25);
  });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateEloMatchResult, calculateEloRating, getExpectedScore } from '../server/src/elo';

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
});

/**
 * Calculate the expected score for player A against player B
 * @param {number} ratingA Current ELO rating of Player A
 * @param {number} ratingB Current ELO rating of Player B
 * @returns {number} Expected score between 0 and 1
 */
const getExpectedScore = (ratingA, ratingB) => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

/**
 * Calculate new ELO ratings after a match.
 * @param {number} ratingA Current ELO rating of Player A
 * @param {number} ratingB Current ELO rating of Player B
 * @param {number} actualScoreA 1 for win, 0.5 for draw, 0 for loss
 * @param {number} kFactor ELO K-factor (default 32)
 * @returns {object} { newRatingA, newRatingB }
 */
const calculateNewRatings = (ratingA, ratingB, actualScoreA, kFactor = 32) => {
  const expectedA = getExpectedScore(ratingA, ratingB);
  const expectedB = getExpectedScore(ratingB, ratingA);
  
  const actualScoreB = 1 - actualScoreA; // if A wins (1), B loses (0)

  const newRatingA = Math.round(ratingA + kFactor * (actualScoreA - expectedA));
  const newRatingB = Math.round(ratingB + kFactor * (actualScoreB - expectedB));

  return { newRatingA, newRatingB };
};

module.exports = {
  getExpectedScore,
  calculateNewRatings
};

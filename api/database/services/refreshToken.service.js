const RefreshToken = require('../models/refreshToken.model');
const { Op } = require('sequelize');

/**
 * Deletes expired refresh tokens from the database.
 * @param {Date} currentTime - The current time.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * @throws {Error} - If there is an error deleting the expired refresh tokens.
 */
async function deleteExpiredRefreshTokens(currentTime) {
  try {
    await RefreshToken.destroy({
      where: {
        expiresAt: {
          [Op.lt]: currentTime
        }
      }
    });
  } catch (error) {
    console.error('Error deleting expired refresh tokens:', error);
    throw error;
  }
}

module.exports = {
  deleteExpiredRefreshTokens
}

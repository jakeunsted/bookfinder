import { Op } from 'sequelize';
import { RefreshToken } from '../models/refreshToken.model.ts';

/**
 * Deletes expired refresh tokens from the database.
 * @param {Date} currentTime
 * @returns {Promise<void>}
 * @throws {Error}
 */
export async function deleteExpiredRefreshTokens(
  currentTime: Date
): Promise<void> {
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


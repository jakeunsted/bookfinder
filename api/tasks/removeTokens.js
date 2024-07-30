const cron = require('node-cron');
const refreshTokenService = require('../database/services/refreshToken.service');

/**
 * Schedule to delete expired refresh tokens every hour
 */
function scheduleTokenDeletion() {
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();
      await refreshTokenService.deleteExpiredRefreshTokens(now);
      console.log('Expired refresh tokens deleted');
    } catch (error) {
      console.error('Error deleting expired refresh tokens:', error);
    }
  });
}

module.exports = scheduleTokenDeletion;

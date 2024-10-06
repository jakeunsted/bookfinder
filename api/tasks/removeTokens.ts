import cron from 'node-cron';
import { 
  deleteExpiredRefreshTokens
} from '../database/services/refreshToken.service.ts';

/**
 * Schedule to delete expired refresh tokens every hour
 */
function scheduleTokenDeletion(): void {
  cron.schedule('0 */6 * * *', async () => {
    try {
      const now = new Date();
      await deleteExpiredRefreshTokens(now);
      console.log('Expired refresh tokens deleted');
    } catch (error) {
      console.error('Error deleting expired refresh tokens:', error);
    }
  });
}

export default scheduleTokenDeletion;

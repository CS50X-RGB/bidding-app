import cron from 'node-cron';
import BidService from '../services/bidsService';

const bidService = new BidService();

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log(`[Cron] Running bid expiration job at ${new Date().toISOString()}`);
    await bidService.updateExpiredBids();
});

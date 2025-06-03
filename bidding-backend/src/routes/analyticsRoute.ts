import Router from 'express'
import AnalyticsService from '../services/analyticsService';
import UserMiddleware from '../middleware/userMiddleware';

const router = Router();

const analyticsService = new AnalyticsService();
const userMiddleware = new UserMiddleware();

router.get('/total',userMiddleware.verifyAdmin.bind(userMiddleware),analyticsService.getDashboardAnalytics.bind(analyticsService))

export default router
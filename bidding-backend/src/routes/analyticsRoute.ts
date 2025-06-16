import Router from 'express'
import AnalyticsService from '../services/analyticsService';
import UserMiddleware from '../middleware/userMiddleware';

const router = Router();

const analyticsService = new AnalyticsService();
const userMiddleware = new UserMiddleware();

router.get('/total',userMiddleware.verifyAdmin.bind(userMiddleware),analyticsService.getDashboardAnalytics.bind(analyticsService))


router.get(
  '/seller',
  userMiddleware.verifySeller.bind(userMiddleware), // make sure it verifies a seller
  analyticsService.getSellerDashboardAnalytics.bind(analyticsService)
);

// routes
router.get("/bidder", 
  userMiddleware.verifyBidder.bind(userMiddleware),
  analyticsService.getBidderDashboardAnalytics.bind(analyticsService)
);

export default router
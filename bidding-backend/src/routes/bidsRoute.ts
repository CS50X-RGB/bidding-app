import { Router } from "express";
import BidsService from "../services/bidsService";
import BidsMiddleware from "../middleware/bidsMiddleware";
import UserMiddleware from "../middleware/userMiddleware";
import { uploadMultiple } from "../utils/upload";



const router = Router();
const bidsService = new BidsService();
const bidsMiddleware = new BidsMiddleware();
const userMiddleware = new UserMiddleware();

router.post('/create',
    userMiddleware.verify.bind(userMiddleware),
    uploadMultiple,
    bidsMiddleware.createBid.bind(bidsMiddleware),
    bidsService.createBid.bind(bidsService)
);

router.get('/my/bids',
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getBidByMe.bind(bidsService)
);

router.get('/all',
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getAllBids.bind(bidsService)
);

router.get('/admin/all',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getAllBids.bind(bidsService)
);

router.get('/:catId',
    bidsMiddleware.checkcatId.bind(bidsMiddleware),
    bidsService.getBidByCategory.bind(bidsService)
);

router.get("/count/",
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getBidsCountByCategory.bind(bidsService)
);
router.put("/accepted/:bidId/:orderId",
    userMiddleware.verify.bind(userMiddleware),
    bidsMiddleware.acceptOrder.bind(bidsMiddleware),
    bidsService.updateOrder.bind(bidsService)
)
router.get("/admin/get/accepted/",
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getAcceptedOrders.bind(bidsService)
)
router.get("/get/my/accepted/",
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getAcceptedOrdersByMe.bind(bidsService)
)
router.get("/get/rejected",
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getRejectedOrders.bind(bidsService)
)

router.get("/get/:bidId",
    userMiddleware.verify.bind(userMiddleware),
    bidsMiddleware.checkbidId.bind(bidsMiddleware),
    bidsService.getOrdersByBidId.bind(bidsService)
);

router.patch("/approveBid/:bidId",
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsMiddleware.checkbidId.bind(bidsMiddleware),
    bidsService.approveBid.bind(bidsService)
)
router.patch("/rejectBid/:bidId",
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsMiddleware.checkbidId.bind(bidsMiddleware),
    bidsService.rejectBid.bind(bidsService)
)
router.get("/get/my/inprogress",
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getMyInprogressBids.bind(bidsService)
)
router.get("/all/approvedbids",
    //userMiddleware.verify.bind(userMiddleware),
    bidsService.getApprovedBid.bind(bidsService)
)

router.get("/allbids/:sellerId",
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsMiddleware.checkId.bind(bidsMiddleware),
    bidsService.getBidsBySellerId.bind(bidsService)

)

router.get('/user/:id',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getBidsByUserId.bind(bidsService)
);
router.get('/user/bidder/all/bids/:id',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getBidsByBidderOrders.bind(bidsService)
);

router.get('/get/bid/bidId/:id',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getBidByBidId.bind(bidsService)
)

router.delete('/:bidId',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.delteBidById.bind(bidsService)
)




// router.get('/:name',
//     categoryMiddleware.getCategory.bind(categoryMiddleware),
//     categoryService.getCategoryId.bind(categoryService),
// );

// router.get('/all/categories', categoryService.getCategory.bind(categoryService));
export default router;

import { Router } from "express";
import BidsService from "../services/bidsService";
import BidsMiddleware from "../middleware/bidsMiddleware";
import UserMiddleware from "../middleware/userMiddleware";
import { uploadMultiple } from "../utils/upload";



const router = Router();
const bidsService = new BidsService();
const bidsMiddleware = new BidsMiddleware();
const userMiddleware = new UserMiddleware();


//This route is to create a bid 
router.post('/createBid',
    userMiddleware.verify.bind(userMiddleware),
    uploadMultiple,
    bidsMiddleware.createBid.bind(bidsMiddleware),
    bidsService.createBid.bind(bidsService)
);

//This route is to get the all bids of a user 
router.get('/my/bids',
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getBidByMe.bind(bidsService)
);

//This route is to get the all bids 
router.get('/all',
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getAllBids.bind(bidsService)
);
//This route is to get the all bids for a admin
router.get('/admin/all',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getAllBids.bind(bidsService)
);

//This route is to get the all bids by category id
router.get('/:catId',
    bidsMiddleware.checkcatId.bind(bidsMiddleware),
    bidsService.getBidByCategory.bind(bidsService)
);

//This route is to get the  bids counts by category 
router.get("/count/",
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getBidsCountByCategory.bind(bidsService)
);

//This route is to update the orders of the bid
router.put("/accepted/:bidId/:orderId",
    userMiddleware.verify.bind(userMiddleware),
    bidsMiddleware.acceptOrder.bind(bidsMiddleware),
    bidsService.updateOrder.bind(bidsService)
)

router.get("/admin/get/accepted/",
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getAcceptedOrders.bind(bidsService)
)

//thi router is to get the accepted bids / completed bids
router.get("/get/my/accepted/",
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getAcceptedOrdersByMe.bind(bidsService)
)

//This route is to get the all Rejected orders
router.get("/get/rejected",
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getRejectedOrders.bind(bidsService)
)

//This route is to get the all the orders by bid id
router.get("/get/:bidId",
    userMiddleware.verify.bind(userMiddleware),
    bidsMiddleware.checkbidId.bind(bidsMiddleware),
    bidsService.getOrdersByBidId.bind(bidsService)
);

//This route is to update bid status to approved
router.patch("/approveBid/:bidId",
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsMiddleware.checkbidId.bind(bidsMiddleware),
    bidsService.approveBid.bind(bidsService)
)

//This route is use to update the bid status to reject
router.patch("/rejectBid/:bidId",
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsMiddleware.checkbidId.bind(bidsMiddleware),
    bidsService.rejectBid.bind(bidsService)
)

//This route is to get the all inprogess
router.get("/get/my/inprogress",
    userMiddleware.verify.bind(userMiddleware),
    bidsService.getMyInprogressBids.bind(bidsService)
)

//This route is to get the all approve bids
router.get("/all/approvedbids",
    //userMiddleware.verify.bind(userMiddleware),
    bidsService.getApprovedBid.bind(bidsService)
)

//This route is to get the all bids of a seller 
router.get("/allbids/:sellerId",
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsMiddleware.checkId.bind(bidsMiddleware),
    bidsService.getBidsBySellerId.bind(bidsService)

)

//This route is to get the all bids by user id
router.get('/user/:id',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getBidsByUserId.bind(bidsService)
);

//This route is to get the all bids in which bidder bids
router.get('/user/bidder/all/bids/:id',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getBidsByBidderOrders.bind(bidsService)
);

//This route is to get the  bid by bid id
router.get('/get/bid/bidId/:id',
    userMiddleware.verifyAdmin.bind(userMiddleware),
    bidsService.getBidByBidId.bind(bidsService)
)

//This route is to delete the bids by bid id
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

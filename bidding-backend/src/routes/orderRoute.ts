import OrderService from "../services/orderService";
import OrderMiddleWare from "../middleware/orderMiddleware";
import UserMiddleware from "../middleware/userMiddleware";
import { Router } from "express";

const router = Router();
const userMiddleware = new UserMiddleware();
const orderMiddleware = new OrderMiddleWare();
const orderService = new OrderService();

//This route is to create the order
router.post("/create/:bidId",
    userMiddleware.verify.bind(userMiddleware),
    orderMiddleware.checkBidId.bind(orderMiddleware),
    orderService.createOrder.bind(orderService)
);

export default router;
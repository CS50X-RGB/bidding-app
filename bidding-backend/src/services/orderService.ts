import BidsRepository from "../database/repositories/bigRepository";
import OrderRepository from "../database/repositories/orderRepository";
import { Request, Response } from "express";
import { OrderInterface } from "../interfaces/orderInterface";

class OrderService {
    private orderRepo: OrderRepository;
    private bidRepo: BidsRepository;
    constructor() {
        this.orderRepo = new OrderRepository();
        this.bidRepo = new BidsRepository();
    }

    // Creates a new order for a given bid and links it to the user and bid.
    public async createOrder(req: Request, res: Response) {
        try {
            const { bidAmount } = req.body;
            const bidId: any = req.params.bidId;
            console.log(bidId);
            if (!req.user) {
                return res.sendError(null, "User Not Loged In", 400);
            }
            const userId = req.user._id;
            console.log(userId,"UserId");
            const orderObject: OrderInterface = {
                bidAmount,
                bid: bidId,
                createdBy: userId
            }
            const newOrder = await this.orderRepo.create(orderObject);
            const bidObject = await this.bidRepo.pushOrder(bidId, newOrder._id);
            return res.sendFormatted({
                bid: bidObject
            }, "Created new Order", 200);
        } catch (error) {
            return res.sendError(error, "Error While Creating Order", 400);
        }
    }
}
export default OrderService;

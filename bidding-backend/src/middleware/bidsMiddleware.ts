import { Request, Response, NextFunction } from "express";
import { BidInterfaceCreation } from "../interfaces/bidInterface";


class BidsMiddleware {
    constructor() { }

    //Middleware function for creting bid
    public async createBid(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body, "BODY OF REQUEST");
            const { name, description, category, totalPrice, images }: BidInterfaceCreation = req.body;
            if (!name || !description || !category || !totalPrice) {
                return res.sendError(null, "Required fields are not provided", 400);
            }
            next();
        } catch (error) {
            return res.sendError(error, "Error in Middleware Bid", 500);
        }
    }

    //Middleware function to  id 
    public async checkId(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.sendError(null, "Id is not found in params", 400);
            }
            next();
        } catch (error) {
            return res.sendError(error, "Error in Middleware Bid", 500);
        }
    }

    //Middleware function for checking catehory Id
    public async checkcatId(req: Request, res: Response, next: NextFunction) {
        try {
            const catId = req.params.catId;
            if (!catId) {
                return res.sendError(null, "Category Id is not found in params", 400);
            }
            next();
        } catch (error) {
            return res.sendError(error, "Error in Middleware Bid", 500);
        }
    }

    //Middleware function for checking bid id
    public async checkbidId(req: Request, res: Response, next: NextFunction) {
        try {
            const bidId = req.params.bidId;
            if (!bidId) {
                return res.sendError(null, "Bid Id is not found in params", 400);
            }
            next();
        } catch (error) {
            return res.sendError(error, "Error in Middleware Bid", 500);
        }
    }

    //Middleware function for accepting order
    public async acceptOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const bidId = req.params.bidId;
            const orderId = req.params.orderId;
            if (!bidId || !orderId) {
                return res.sendError(null, "Bid Id or OrderId is not found in params", 400);
            }
            next();
        } catch (error) {
            return res.sendError(error, "Error in Middleware Bid", 500);
        }
    }
}

export default BidsMiddleware;

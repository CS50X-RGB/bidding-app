import { Request,Response,NextFunction } from "express";

class OrderMiddleWare{
    constructor(){}

    //Middleware function for checking bid id
    public async checkBidId(req : Request,res : Response,next : NextFunction){
        try {
            const bidId = req.params.bidId;
            const bidAmount = req.body;
            if(!bidId || !bidAmount){
                return res.sendError(null,"Bid Id Not Found or Bid Amount Not Found",400);
            }
            next();
        } catch (error) {
            return res.sendError(error,"Bid Id Middleware",500);
        }
    }
}

export default OrderMiddleWare;
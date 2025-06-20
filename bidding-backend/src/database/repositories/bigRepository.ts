import { BidInterfaceCreation } from "../../interfaces/bidInterface";
import mongoose, { ObjectId, Types } from "mongoose";
import BidsModel, { BidStatus } from "../models/bidsModel";
import CategoryRepository from "./categoryRepository";
import OrderModel, { IOrderSchema } from "../models/orderModel";
import bidsModel from "../models/bidsModel";
import path from "path";
import { populate } from "dotenv";
import { AWS_BUCKET } from "../../config/config";
import s3 from "../../config/aws_config";
interface BidInterface extends BidInterfaceCreation {
    createdBy: mongoose.Schema.Types.ObjectId;
}

class BidsRepository {
    private categoryRepo: CategoryRepository
    constructor() {
        this.categoryRepo = new CategoryRepository();
    }

    //this api is to creare the bid
    public async createBid(bid: BidInterface): Promise<any | null> {
        try {
            const newBid = await BidsModel.create({
                ...bid,
                maxtotalPrice: bid.totalPrice
            });
            return newBid.toObject();
        } catch (error: any) {
            throw new Error(`Error creating bid: ${error.message}`);
        }
    }

    //this api is to get the bids data by bidId
    public async getBidById(id: ObjectId): Promise<any | null> {
        try {
            return await BidsModel.findById(id)
                .populate("category")
                .populate("createdBy")
                .lean();
        } catch (error: any) {
            throw new Error(`Error getting bid by ID: ${error.message}`);
        }
    }

    //this api is for to get user bids by passing user id
    public async getAllBidsByUser(userId: ObjectId): Promise<any[] | null> {
        try {
            return await BidsModel.find({ createdBy: userId })
                .populate("category")
                .populate("createdBy")
                .populate({
                    path: "orders",
                    populate: {
                        path: "createdBy"
                    }
                })
                .lean();
        } catch (error: any) {
            throw new Error(`Error getting all bids by user: ${error.message}`);
        }
    }

    //This api fetch all the bids to show on admin view (ADMIN)
    public async getAllBids(): Promise<any[] | null> {
        try {
            return await BidsModel.find() //{ status: { $in: [BidStatus.INPROGRESS, BidStatus.PENDING] } }
                .sort({ createdAt: -1 })
                .populate("category")
                .populate("createdBy")
                .populate("acceptedBy")
                .populate({
                    path: "orders",
                    populate: ({
                        path: "createdBy"
                    })
                })
                .lean();
        } catch (error: any) {
            throw new Error(`Error getting all bids: ${error.message}`);
        }
    }

    //This api fetches all the bids by its category id 
    public async getBidsByCategory(categoryId: any): Promise<any | null> {
        try {
            const bids = await BidsModel.find({
                category: categoryId,
            })
                .sort({ createdAt: -1 })
                .populate("category")
                .populate("createdBy")
                .lean();
            return bids;
        } catch (error) {
            throw new Error(`Error fetching bids by category: ${error}`);
        }
    }

    //This api Fetchs the category wise bid count
    public async getBidsCountByCat(): Promise<any | null> {
        try {
            const categories = await this.categoryRepo.getAll();
            const results = [];
            for (const c of categories) {
                const count = await BidsModel.countDocuments({
                    category: c.name,
                    status: { $in: [BidStatus.PENDING, BidStatus.INPROGRESS] }
                });
                results.push({
                    category: c.name,
                    bidCount: count,
                });
            }
            return results;
        } catch (error) {
            console.error("Error fetching bids by category:", error);
            return null;
        }
    }

    //This api is used to push the orders placed insdie the bid document 
    public async pushOrder(bidId: ObjectId, orderId: ObjectId): Promise<any | null> {
        try {
            const bidDoc: any = await BidsModel.findByIdAndUpdate(bidId, {
                $push: { orders: orderId },
            },
                {
                    new: true
                });
            if (!bidDoc) {
                throw new Error("Bid not found");
            }
            if (bidDoc.status === BidStatus.APPROVED) {
                bidDoc.status = BidStatus.INPROGRESS
            }
            const orderModels = await OrderModel.find({
                bid: bidId
            });
            const maxTotalPrice = orderModels.reduce((max: any, order: IOrderSchema) => {
                console.log(max, "max");
                return order.bidAmount > max ? order.bidAmount : max
            }, 0);
            bidDoc.maxtotalPrice = maxTotalPrice;
            await bidDoc?.save();
            return bidDoc.toObject();
        } catch (error: any) {
            throw new Error(`Error fetching bids by category: ${error}`);
        }
    }

    //this api to get the all accepted orders by seller
    public async getAllAcceptedOrdersByMe(userId: any): Promise<any[] | null> {
        try {
            const bids = await BidsModel.find({
                status: BidStatus.ACCEPTED,
            })
                .sort({ createdAt: -1 })
                .populate("category")
                .populate("createdBy")
                .populate("acceptedBy")
                .populate("orders").lean();
            return bids;
        } catch (error: any) {
            throw new Error(`Error fetching accepted orders: ${error.message}`);
        }
    }

    //this api is used to fetch all the accepted order  
    public async getAllAcceptedOrders(): Promise<any[] | null> {
        try {
            const bids = await BidsModel.find({
                status: BidStatus.ACCEPTED,
            })
                .sort({ createdAt: -1 })
                .populate("category")
                .populate("createdBy")
                .populate("acceptedBy")
                .populate("orders").lean();
            return bids;
        } catch (error: any) {
            throw new Error(`Error fetching accepted orders: ${error.message}`);
        }
    }
    
    //this api is used to get all the rejected order
    public async getAllRejecteddOrders(): Promise<any[] | null> {
        try {
            const bids = await BidsModel.find({
                status: BidStatus.REJECTED,
            })
                .sort({ createdAt: -1 })
                .populate("category")
                .populate("createdBy")
                .populate("acceptedBy")
                .populate("orders").lean();
            return bids;
        } catch (error: any) {
            throw new Error(`Error fetching accepted orders: ${error.message}`);
        }
    }
    
    //this api is used to fetch the oders by bidid
    public async getOrdersByBidId(bidId: ObjectId): Promise<any | null> {
        try {
            const bid = await BidsModel.findById(bidId)
                .populate("category")
                .populate("createdBy")
                .populate({
                    path: 'orders',
                    model: 'order',
                    populate: {
                        path: 'createdBy',
                        model: 'user',
                        select: '-password',
                    },
                }).lean();

            if (bid == null) {
                throw new Error("Cant Find the Bid ID");
            }
            return bid;
        } catch (error) {
            throw new Error(`Error while getting order ${error}`)
        }
    }

    //this api is used to accepet order on the bid
    public async acceptOrder(bidId: ObjectId, orderID: ObjectId): Promise<any | null> {
        try {
            const orderObj = await OrderModel.findById(orderID);
            if (!orderObj) {
                throw new Error("Order not found");
            }
            const bid = await BidsModel.findByIdAndUpdate(
                bidId,
                {
                    status: BidStatus.ACCEPTED,
                    acceptedBy: orderObj.createdBy,
                },
                { new: true }
            )
                .populate("category")
                .populate("createdBy")
                .populate("orders");

            if (!bid) {
                throw new Error("Bid not found");
            }

            return bid.toObject();
        } catch (error: any) {
            throw new Error(`Error while accepting the order: ${error.message}`);
        }
    }

    //this api is used to reject the order
    public async rejectOrder(bidId: ObjectId): Promise<any | null> {
        try {
            const bid = await BidsModel.findByIdAndUpdate(
                bidId,
                {
                    status: BidStatus.REJECTED,
                },
                { new: true }
            )
                .populate("category")
                .populate("createdBy")
            if (bid?.acceptedBy) {
                bid.populate("acceptedBy")
            }
            if (!bid) {
                throw new Error("Bid not found");
            }

            return bid.toObject();
        } catch (error: any) {
            throw new Error(`Error while accepting the order: ${error.message}`);
        }
    }

    //This api is use to get the inprogress bids for the seller 
    public async getMyBidsInProgress(userId: ObjectId): Promise<any | null> {
        try {
            const bids = await BidsModel.find({
                createdBy: userId,
                status: BidStatus.INPROGRESS
            }).populate('category').populate('createdBy').lean();
            return bids;
        } catch (error) {
            throw new Error(`Error during getting Bids ${error}`);
        }
    }

    //-----------------------ADMIN ANALYTICS START------------------------------//

    //get total bids count
    public async getTotalBidsCount(): Promise<any | null> {
        try {
            const count = await BidsModel.countDocuments();
            return count;
        } catch (error) {
            throw new Error(`Error getting total bids count: ${error}`);
        }
    }
    //get bids value 
    public async getTotalBidsValue(status?: BidStatus): Promise<any | null> {

        try {
            let bids;
            if (!status) {
                bids = await BidsModel.aggregate([
                    {
                        $group: {

                            _id: null,
                            totalValue: { $sum: "$maxtotalPrice" }
                        },
                    }

                ])
            } else {
                bids = await BidsModel.aggregate([
                    {
                        $match: { status: status }
                    },
                    {
                        $group: {
                            _id: null,
                            totalValue: { $sum: "$maxtotalPrice" }
                        },
                    }

                ])
            }

            return bids[0]?.totalValue || 0;
        }
        catch (error) {
            throw new Error(`Error getting total bids value: ${error}`);
        }

    }

    //get bid count by status
    public async getBidsCountByStatus(): Promise<any | null> {
        try {
            const result = await BidsModel.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ])

            const counts: Record<string, Number> = {
                pending: 0,
                inprogress: 0,
                accepted: 0,
                rejected: 0
            }

            for (const entry of result) {
                counts[entry._id] = entry.count
            }
            return counts;
        } catch (error) {
            throw new Error(`Error getting bids stauts: ${error}`);
        }
    }

    //-----------------------ADMIN ANALYTICS END------------------------------//


    //This API is used is approve bid status (when admin sends request)
    public async approveBid(bidId: ObjectId): Promise<any | null> {
        try {
            return await BidsModel.findByIdAndUpdate(
                bidId,
                { status: BidStatus.APPROVED },
                { new: true }
            )
                .populate("category")
                .populate("createdBy")
                .lean();
        } catch (error) {
            throw new Error(`Error in approving bids: ${error}`);
        }
    }

    //This API is used is approve bid status (when admin sends request)
    public async rejectBid(bidId: ObjectId): Promise<any | null> {
        try {
            return await BidsModel.findByIdAndUpdate(
                bidId,
                { status: BidStatus.REJECTED },
                { new: true }
            )
                .populate("category")
                .populate("createdBy")
                .lean();
        } catch (error) {
            throw new Error(`Error in Rejecting bids: ${error}`);
        }
    }

    //This api is used to get only the approved bids for the bidder View (BIDDER)
    public async getApprovedBids(): Promise<any[] | null> {
        try {
            return await BidsModel.find({
                status: { $in: [BidStatus.APPROVED, BidStatus.INPROGRESS] },
                $expr: {
                    $and: [
                        { $gte: [new Date(), "$bidPublishedDate"] },
                        {
                            $lte: [
                                new Date(),
                                {
                                    $add: [
                                        "$bidPublishedDate",
                                        { $multiply: ["$durationInDays", 24 * 60 * 60 * 1000] }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            })
                .sort({ createdAt: -1 })
                .populate("category")
                .populate("createdBy")
                .lean();
        } catch (error: any) {
            throw new Error(`Error getting all bids: ${error.message}`);
        }
    }

    //This api is to fetch all the bids of a seller by seller id as an object
    public async getBidsBySellerId(sellerId: ObjectId): Promise<any[] | null> {
        try {
            // Example: Fetch bids from DB
            const bids = await BidsModel.find({ createdBy: sellerId })
            const total = await BidsModel.countDocuments({ createdBy: sellerId })
            return bids;

        } catch (error) {
            console.error('Error fetching bids by sellerId:', error);
            return null;
        }
    }

     //This api is to fetch all the bids of a user by user id as a  string
    public async getAllBidsBySeller(userId: string): Promise<any[] | null> {
        try {
            // Convert string to Mongo ObjectId
            const objectId = new Types.ObjectId(userId);

            return await BidsModel.find({ createdBy: objectId })
                .sort({ createdAt: -1 })
                .populate("category")
                .populate({
                    path: "createdBy",
                    populate: {
                        path: "role"
                    }
                })

                .lean();
        } catch (error: any) {
            throw new Error(`Error getting all bids by user: ${error}`);
        }
    }

    //This api is use to get all the bid of a user along with orders
    public async getAllBidsWithOrdersByUser(userId: string): Promise<any[] | null> {
        try {
            const objectId = new Types.ObjectId(userId);

            // Find all orders created by this user, with fully populated bid info
            const orders = await OrderModel.find({ createdBy: objectId })
                .sort({ createdAt: -1 })
                .populate({
                    path: "bid",
                    populate: [
                        { path: "category" },
                        { path: "orders" },
                    ],
                })
                .populate({
                    path: "createdBy",
                    populate: {
                        path: "role"
                    }
                })
                .lean();

            // Just return all orders, each with populated bid info
            return orders;
        } catch (error: any) {
            throw new Error(`Error getting bids with user orders: ${error}`);
        }
    }

    //This api is used to get the particular bid with bid id
    public async getBidByBidId(bidId: string): Promise<any | null> {
        try {
            const objectId = new Types.ObjectId(bidId);

            const bid = await bidsModel.findById(objectId)
                .populate({
                    path: "orders",
                    options: { sort: { createdAt: -1 } },
                    populate: {
                        path: "createdBy"
                    }
                })
                .populate("category")
                .populate("createdBy")



            return bid;
        } catch (error) {

        }
    }

    //This api is use to update the bidder live bids view by checking the expied bids using cron job
    public async updateExpiredBids(): Promise<void> {
        try {
            const now = new Date();

            // Find bids that are APPROVED or INPROGRESS but already expired
            const expiredBids = await BidsModel.find({
                status: { $in: [BidStatus.APPROVED, BidStatus.INPROGRESS] },
                $expr: {
                    $lt: [
                        {
                            $add: [
                                "$bidPublishedDate",
                                { $multiply: ["$durationInDays", 24 * 60 * 60 * 1000] }
                            ]
                        },
                        now
                    ]
                }
            }).populate({
                path: "orders",
                options: { sort: { bidAmount: -1 } }, // Highest bid first
                populate: {
                    path: "createdBy"
                }
            });
            console.log(`Expired bids processed: ${expiredBids.length}`);
            for (const bid of expiredBids) {
                if (bid.orders && bid.orders.length > 0) {
                    // Set status to accepted and assign winner
                    bid.status = BidStatus.ACCEPTED;
                    // Ensure orders are populated and have createdBy as an object or ObjectId
                    const winnerOrder: any = bid.orders[0];
                    bid.acceptedBy = winnerOrder.createdBy;
                } else {
                    // No orders, mark as expired
                    bid.status = BidStatus.EXPIRED;
                }

                await bid.save();
            }
        } catch (error) {
            console.error("Error updating expired bids:", error);
        }
    }

    //This api is use to delete the bid by bidId
    public async deleteBidById(bidId: string): Promise<any | null> {
        try {
            const bid = await bidsModel.findById(bidId);
            if (!bid) throw new Error(`Bid with id ${bidId} not found`);

            if (bid.images && bid.images.length > 0) {
                const keys = bid.images.map((url: string) => this.extractKeyFromUrl(url));
                console.log("Deleting keys:", keys);

                const deleteObjects = {
                    Bucket: AWS_BUCKET as string,
                    Delete: {
                        Objects: keys.map((key) => ({ Key: key })),
                    },
                };

                const s3Response = await s3.deleteObjects(deleteObjects).promise();
                console.log("S3 delete response:", JSON.stringify(s3Response, null, 2));
            }

            const deletedBid = await bidsModel.findByIdAndDelete(bidId);
            if (!deletedBid) {
                throw new Error(`Bid with id ${bidId} not found`);
            }

            await OrderModel.deleteMany({ bid: bidId });

            return deletedBid;
        } catch (error) {
            console.error(`Error deleting bid: ${error}`);
            throw new Error(`Error deleting bid: ${error}`);
        }
    }

    //Helper function to for delete bid
    private extractKeyFromUrl(url: string): string {
        const urlObj = new URL(url);
        return urlObj.pathname.slice(1);
    }


    //---------------------SELLER ANYLYTICS ROUTE----------------------------------------------//

    // Get total bids count for a seller
    public async getTotalBidsCountForSeller(sellerId: string): Promise<number> {
        try {
            return await BidsModel.countDocuments({ createdBy: new mongoose.Types.ObjectId(sellerId) });
        } catch (error) {
            throw new Error(`Error getting seller bids count: ${error}`);
        }
    }


    // Get total bids value for a seller (optional status)
    public async getTotalBidsValueForSeller(sellerId: string, status?: BidStatus): Promise<number> {
        try {
            const match: any = { createdBy: new mongoose.Types.ObjectId(sellerId) };
            if (status) match.status = status;

            const result = await BidsModel.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: null,
                        totalValue: { $sum: "$maxtotalPrice" }
                    }
                }
            ]);

            return result[0]?.totalValue || 0;
        } catch (error) {
            throw new Error(`Error getting seller bids value: ${error}`);
        }
    }

    // Get bids count by status for a seller
    public async getBidsCountByStatusForSeller(sellerId: string): Promise<Record<string, number>> {
        try {
            const result = await BidsModel.aggregate([
                { $match: { createdBy: new mongoose.Types.ObjectId(sellerId) } },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);

            const counts: Record<string, number> = {
                pending: 0,
                inprogress: 0,
                accepted: 0,
                rejected: 0,
            };

            for (const entry of result) {
                counts[entry._id] = entry.count;
            }

            return counts;
        } catch (error) {
            throw new Error(`Error getting seller bids count by status: ${error}`);
        }
    }

    //---------------------SELLER ANYLYTICS ROUTE END----------------------------------------------//



    //---------------------Bidder ANYLYTICS ROUTE ------------------------------------------------//

    // Count all orders by this bidder
    public async getTotalOrdersForBidder(bidderId: string): Promise<number> {
        return OrderModel.countDocuments({ createdBy: new mongoose.Types.ObjectId(bidderId) });

    }

    public async getOrdersInfoForBidder(bidderId: string): Promise<{ totalCount: number; orders: any[] }> {
        const orders = await OrderModel.find({
            createdBy: new mongoose.Types.ObjectId(bidderId),
        })  
            
            .populate({
                path: "bid",
                select: "name description status totalPrice maxtotalPrice createdBy bidPublishedDate durationInDays acceptedBy",
                populate:{
                    path:"createdBy"
                }
            })
            .populate({
                path: "createdBy",
                select: "name", // optional: bidder's name if needed
            })
            .lean();

        const totalCount = orders.length;

        return {
            totalCount,
            orders,
        };
    }

    // Count accepted orders for this bidder (linked bid must be 'accepted' status)
    public async getAcceptedOrdersForBidder(bidderId: string): Promise<number> {
        return OrderModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(bidderId) } },
            {
                $lookup: {
                    from: "bids",
                    localField: "bid",
                    foreignField: "_id",
                    as: "bidDetails"
                }
            },
            { $unwind: "$bidDetails" },
            { $match: { "bidDetails.status": "accepted" } },
            { $count: "count" }
        ]).then(r => r[0]?.count || 0);
    }

    // Sum all bidAmounts by this bidder
    public async getTotalBidAmountForBidder(bidderId: string): Promise<number> {
        const result = await OrderModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(bidderId) } },
            { $group: { _id: null, total: { $sum: "$bidAmount" } } }
        ]);
        return result[0]?.total || 0;
    }

    // Sum accepted bidAmounts
    public async getAcceptedBidAmountForBidder(bidderId: string): Promise<number> {
        const result = await OrderModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(bidderId) } },
            {
                $lookup: {
                    from: "bids",
                    localField: "bid",
                    foreignField: "_id",
                    as: "bidDetails"
                }
            },
            { $unwind: "$bidDetails" },
            { $match: { "bidDetails.status": "accepted" } },
            { $group: { _id: null, total: { $sum: "$bidAmount" } } }
        ]);
        return result[0]?.total || 0;
    }

    // Unique bids this bidder participated in
    public async getTotalBidsParticipatedForBidder(bidderId: string): Promise<number> {
        const result = await OrderModel.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(bidderId) } },
            { $group: { _id: "$bid" } },
            { $count: "count" }
        ]);
        return result[0]?.count || 0;
    }

    //---------------------Bidder ANYLYTICS ROUTE ------------------------------------------------//






}

export default BidsRepository;

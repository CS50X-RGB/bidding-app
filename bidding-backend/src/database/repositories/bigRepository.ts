import { BidInterfaceCreation } from "../../interfaces/bidInterface";
import mongoose, { ObjectId, Types } from "mongoose";
import BidsModel, { BidStatus } from "../models/bidsModel";
import CategoryRepository from "./categoryRepository";
import OrderModel, { IOrderSchema } from "../models/orderModel";
import bidsModel from "../models/bidsModel";
import path from "path";
import { populate } from "dotenv";

interface BidInterface extends BidInterfaceCreation {
    createdBy: mongoose.Schema.Types.ObjectId;
}

class BidsRepository {
    private categoryRepo: CategoryRepository
    constructor() {
        this.categoryRepo = new CategoryRepository();
    }


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

    public async getAllBidsByUser(userId: ObjectId): Promise<any[] | null> {
        try {
            return await BidsModel.find({ createdBy: userId })
                .populate("category")
                .populate("createdBy")
                .lean();
        } catch (error: any) {
            throw new Error(`Error getting all bids by user: ${error.message}`);
        }
    }

    //for admin 
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
                            totalValue: { $sum: "$totalPrice" }
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
                            totalValue: { $sum: "$totalPrice" }
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






}

export default BidsRepository;

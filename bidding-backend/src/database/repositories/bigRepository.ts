import { BidInterfaceCreation } from "../../interfaces/bidInterface";
import mongoose, { ObjectId } from "mongoose";
import BidsModel, { BidStatus } from "../models/bidsModel";
import CategoryRepository from "./categoryRepository";
import OrderModel, { IOrderSchema } from "../models/orderModel";

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
    public async getAllBids(): Promise<any[] | null> {
        try {
            return await BidsModel.find({
                status: { $in: [BidStatus.INPROGRESS, BidStatus.PENDING] }
            })
                .populate("category")
                .populate("createdBy")
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
            if (bidDoc.status === BidStatus.PENDING) {
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

}

export default BidsRepository;

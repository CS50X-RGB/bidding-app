import mongoose from "mongoose";

////Interface for order
export interface OrderInterface {
    bidAmount: Number,
    bid: mongoose.Schema.Types.ObjectId,
    createdBy: mongoose.Schema.Types.ObjectId
}
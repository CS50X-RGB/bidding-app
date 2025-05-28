import mongoose from "mongoose";

export interface OrderInterface {
    bidAmount: Number,
    bid: mongoose.Schema.Types.ObjectId,
    createdBy: mongoose.Schema.Types.ObjectId
}
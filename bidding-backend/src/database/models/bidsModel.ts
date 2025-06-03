import mongoose, { Schema, Document } from "mongoose";

export enum BidStatus {
    
    PENDING = "pending",
    INPROGRESS = "inprogress",
    APPROVED="approve",
    ACCEPTED = "accepted",
    REJECTED = "rejected",

}

export interface IBids extends Document {
    name: string,
    description: string,
    category: mongoose.Schema.Types.ObjectId[],
    totalPrice: Number,
    maxtotalPrice: Number,
    createdBy: mongoose.Schema.Types.ObjectId,
    createdOn: Date,
    images: [string],
    acceptedBy: mongoose.Schema.Types.ObjectId,
    status: BidStatus,
    orders: mongoose.Schema.Types.ObjectId[],
    
}
const BidSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    maxtotalPrice: {
        type: Number,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    status: {
        type: String,
        enum: BidStatus,
        default: BidStatus.PENDING
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    }],
    images: {
        type: [String],
        default: [],
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    
},{timestamps:true});

export default mongoose.model<IBids>('bid', BidSchema);
import mongoose, { Schema, Document } from "mongoose";

export enum BidStatus {

    PENDING = "pending",
    INPROGRESS = "inprogress",
    APPROVED = "approve",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    EXPIRED = "expired",

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
    incrementalValue: number,
    bidPublishedDate: Date,
    durationInDays: Number,
    createdAt: Date;  // added from timestamps
    updatedAt: Date;  // added from timestamps

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
    incrementalValue: {
        type: Number,
        required: true,
        min: 10,
    },

    bidPublishedDate: {
        type: Date,
        required: true,
        // default: () => {
        //     const d = new Date();
        //     d.setDate(d.getDate() + 3); // 3 days after now
        //     return d;
        // },
        validate: {
            validator: function (this: any, value: Date) {
                const created = new Date(this.createdOn || this.createdAt || Date.now());

                // Strip time from both dates (set to midnight)
                //const minDate = new Date(created.getFullYear(), created.getMonth(), created.getDate() + 3);
                const minDate = new Date(created.getTime() + 1 * 60 * 1000); // 1 minute after creation

                const inputDate = new Date(value.getFullYear(), value.getMonth(), value.getDate());

                return inputDate >= minDate;
            },
            message: "Start date must be at least 3 days after the bid is created",
        }
    },

    durationInDays: {
        type: Number,
        required: true,
        min: 1,
        max: 60
    }


}, { timestamps: true });

export default mongoose.model<IBids>('bid', BidSchema);
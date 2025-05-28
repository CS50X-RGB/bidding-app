import mongoose from "mongoose";



export interface BidInterfaceCreation {
    name: string,
    description : string,
    category: mongoose.Schema.Types.ObjectId[],
    totalPrice: number,
    images?: string[],
}
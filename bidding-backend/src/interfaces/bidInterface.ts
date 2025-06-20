import mongoose from "mongoose";


//In TypeScript, an interface is a way to define the shape of an object.

//Interface for bid creation
export interface BidInterfaceCreation {
    name: string,
    description : string,
    category: mongoose.Schema.Types.ObjectId[],
    totalPrice: number,
    images?: string[],
    incrementalValue: number | string,
    bidPublishedDate?: Date,
    durationInDays:number,
   
}
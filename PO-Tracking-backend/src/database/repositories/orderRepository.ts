import mongoose from "mongoose";
import OrderModel from "../models/orderModel";
import { OrderInterface } from "../../interfaces/orderInterface";

class OrderRepository {
    constructor() {}

    public async create(order: OrderInterface): Promise<any | null> {
        try {
            const newOrderDoc : any = await OrderModel.create(order);
            //const populatedOrder = await newOrderDoc.populate('bid').populate('user'); 
            return newOrderDoc.toObject();
        } catch (error: any) {
            throw new Error(`Order creation failed: ${error.message}`);
        }
    }
}

export default OrderRepository;

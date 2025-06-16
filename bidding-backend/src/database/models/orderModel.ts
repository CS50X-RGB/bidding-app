import mongoose, { Schema, Document } from 'mongoose';
import bidsModel from './bidsModel';

export interface IOrderSchema extends Document {
  bidAmount: Number;
  createdBy: mongoose.Schema.Types.ObjectId,
  bid: mongoose.Schema.Types.ObjectId
}

const OrderSchema: Schema = new Schema({
  bidAmount: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  bid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bid',
    required: true
  }
}, { timestamps: true });

OrderSchema.post('save', async function (doc, next) {
  try {
    const bidId = doc.bid;

    const orders = await mongoose.model('order').find({ bid: bidId });
    const maxAmount = orders.reduce((max, o) => o.bidAmount > max ? o.bidAmount : max, 0);

    const bidDoc: any = await bidsModel.findById(bidId);
    if (bidDoc) {
      bidDoc.maxtotalPrice = Math.max(maxAmount, bidDoc.totalPrice);
      await bidDoc.save();
    }

    next();
  } catch (error) {
    console.error('Error in OrderSchema.post(save):', error);
    next(error as mongoose.CallbackError);
  }
});

export default mongoose.model<IOrderSchema>('order', OrderSchema);

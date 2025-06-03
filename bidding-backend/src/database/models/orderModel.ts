import  mongoose, {Schema,Document} from 'mongoose';

export interface IOrderSchema extends Document {
  bidAmount : Number;
  createdBy : mongoose.Schema.Types.ObjectId,
  bid : mongoose.Schema.Types.ObjectId
}

const OrderSchema : Schema = new Schema({
  bidAmount : {
    type : Number,
    required : true
  },
  createdBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user',
    required : true
  },
  bid : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'bid',
    required : true
  }
},{timestamps:true});

export default mongoose.model<IOrderSchema>('order',OrderSchema);

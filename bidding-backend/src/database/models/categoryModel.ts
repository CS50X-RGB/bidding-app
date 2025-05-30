import  mongoose, {Schema,Document} from 'mongoose';

export interface ICategory extends Document {
  name : string;
}

const CategorySchema : Schema = new Schema({
  name : {
    type : String,
    unique : true,
    required : true
  }
});

export default mongoose.model<ICategory>('category',CategorySchema);

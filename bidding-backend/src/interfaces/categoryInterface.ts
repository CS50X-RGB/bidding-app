import mongoose from "mongoose";

export interface CategoryInterface { 
  name : string;
}
export interface CategoryInterfaceGet{
  _id : mongoose.Schema.Types.ObjectId;
  name : string;
}

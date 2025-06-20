import mongoose from "mongoose";

//Interface for categories
export interface CategoryInterface { 
  name : string;
}

//Interface to get categories
export interface CategoryInterfaceGet{
  _id : mongoose.Schema.Types.ObjectId;
  name : string;
}

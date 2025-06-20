import mongoose from "mongoose";

//Interface for roles
export interface RoleInterface { 
  name : string;
}

//Interface to get roles
export interface RoleInterfaceGet{
  _id : mongoose.Schema.Types.ObjectId;
  name : string;
}

import mongoose from "mongoose";

//Interface for user creation
export interface IUserCreation {
    name: string;
    password: string;
    email: string;
    role: mongoose.Schema.Types.ObjectId;
}

//Interface for user creation
export interface IUserCreate {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    password: string;
    email: string;
    role: mongoose.Schema.Types.ObjectId;
}

//Interface for user signin
export interface IUserSignin {
    name: string;
    password: string;
    email: string;
    role: mongoose.Schema.Types.ObjectId;
}

//Interface that userCreate returin
export interface IUserCreateReturn {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    password: string;
    isBlocked: boolean,
    email: string;
    role: {
        name: string;
    };
}

//Interface for user Login
export interface IUserLogin {
    name: string;
    password: string;
}

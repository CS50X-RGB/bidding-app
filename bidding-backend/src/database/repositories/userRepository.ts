import mongoose, { ObjectId } from "mongoose";
import { IUserCreate, IUserCreation } from "../../interfaces/userInterface";
import User from "../models/userModel";
import CategoryRepository from "./categoryRepository";
import { roles } from "../../app";
import Role, { IRole } from "../models/roleModel"

class UserRepository {
    public async createUser(user: IUserCreation): Promise<IUserCreation | null> {
        try {
            const newUser = await User.create(user);
            return newUser.toObject();
        } catch (error: any) {
            throw new Error(error);
        }
    }
    public async createUserWithToken(user: IUserCreation): Promise<any | null> {
        try {
            const newUser = await User.create(user);
            const populatedUser = await newUser.populate('role');
            return populatedUser.toObject();
        } catch (error: any) {
            throw new Error(error);
        }
    }
    public async getUserByRole(role: mongoose.Schema.Types.ObjectId): Promise<boolean> {
        try {
            const user = await User.findOne({ role });
            return user ? true : false;
        } catch (error: any) {
            throw new Error(error);
        }
    }
    public async getUserByEmail(email: string): Promise<any | null> {
        try {
            const user = await User.findOne({ email }).lean();
            return user;
        } catch (error: any) {
            throw new Error("No user found");
        }
    }
    public async getUserByName(name: string): Promise<any | null> {
        try {
            const user = await User.findOne({ name }).populate('role').lean();
            return user;
        } catch (error: any) {
            throw new Error("No user found");
        }
    }
    public async getUserById(id: mongoose.Schema.Types.ObjectId): Promise<any | null> {
        try {
            const user = await User.findById(id).populate('role');
            if (!user) {
                return null; // or throw new Error("User not found");
            }
            return user.toObject();
        } catch (e) {
            throw new Error("User Not Found")
        }
    }
    public async getAllUsersPaginated(skip: number, limit: number) {
        try {
            const countUser = await User.countDocuments();
            const users = await User.find().skip(skip).limit(limit).populate('role').lean();
            return { users, count: countUser };
        } catch (error) {
            throw new Error("User Not Found")
        }
    }
    public async getAllUser() {
        try {
            const users = await User.find().populate('role').lean();
            return { users, count: users.length };
        } catch (error) {
            throw new Error("User Not Found")
        }
    }

    public async deleteUser(id: ObjectId) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Delete User Failed`);
        }
    }
    public async updateUserIsBlocked(id: ObjectId): Promise<any | null> {
        try {
            const user = await User.findById(id);

            if (!user) {
                throw new Error("User not found");
            }
            user.isBlocked = !user.isBlocked;
            await user.save();
            return user;
        } catch (e: any) {
            throw new Error(`Error updating isBlocked status: ${e.message}`);
        }
    }

    public async getUserCountByRole(role: ObjectId): Promise<any | null> {
        try {
            const totalUserCount = await User.countDocuments({ role: role, isBlocked: false });

            return totalUserCount;

        } catch (error: any) {
            throw new Error(`Error getting user count by role: ${error.message}`);
        }
    }

    public async getAllUsersByRoleName(roleName: string) {
        try {
            // Find role document by name
            const role = await Role.findOne({ name: roleName }).lean();
            if (!role) {
                throw new Error(`Role '${roleName}' not found`);
            }
            //Aggregation PipeLine
            const usersWithBidAndOrderCount = await User.aggregate([
                { $match: { role: role._id } },
                {
                    $lookup: {
                        from: "bids",           // bids collection name
                        localField: "_id",      // user._id
                        foreignField: "createdBy", // bids.createdBy
                        as: "bids"
                    }
                },
                {
                    $lookup: {
                        from: "orders",
                        localField: "_id",
                        foreignField: "createdBy", // count orders accepted by user (assuming this is correct field)
                        as: "orders",
                    },
                },
                {
                    $addFields: {
                        bidCount: { $size: "$bids" },  // count bids array size
                        orderCount: { $size: "$orders" },
                    }
                },
                {
                    $project: {
                        bids: 0,   // exclude full bids array from output
                        orders: 0,

                    }
                }
            ]);

            return { users: usersWithBidAndOrderCount, count: usersWithBidAndOrderCount.length };


        } catch (error: any) {
            throw new Error(`Error fetching users with role '${roleName}': ${error.message}`);
        }
    }

}
export default UserRepository;

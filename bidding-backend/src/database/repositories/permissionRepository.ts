import { PermissionCreate } from "../../interfaces/permissionInterface";
import PermisssionModel from "../models/permissionMode";

class PermissionRepo {
    constructor() { }

    //This api is used to create a new permission
    public async createPermission(permission: PermissionCreate) {
        try {
            const newPermission = await PermisssionModel.create(permission);
            return newPermission.toObject();
        } catch (error) {
            throw new Error(`Error while getting error`);
        }
    }

    //This api is use to get all the permission
    public async getPermissions() {
        try {
            const getAllPermission = await PermisssionModel.find().lean();
            return getAllPermission;
        } catch (error) {
            throw new Error(`Error while getting permissions`);
        }
    }

    //This api is use to get the permission by name
    public async findPermissionByName(name: string): Promise<boolean> {
        try {
            const permission = await PermisssionModel.findOne({ name }).lean();
            return permission ? true : false;
        } catch (e) {
            return false;
        }
    }
}

export default PermissionRepo;
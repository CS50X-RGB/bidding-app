import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/encrypt";

class UserMiddleware {
    constructor() { }

    //Middleware function for creting user
    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                return res.sendError(null, "Invalid fields", 400);
            }
            next();
        } catch (e) {
            throw new Error(`Error while creating user ${e}`);
        }
    }

    //Middleware function for verifying admin
    public async verifyAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.sendError(null, "Invalid authorization header", 400);
            }
            const token = authHeader.split(' ')[1];
            const decoded: any = await verifyToken(token);
            if (decoded.role === "ADMIN") {
                req.user = {
                    _id: decoded._id,
                    name: decoded.name
                }
                next();
            } else {
                return res.sendError(null, "Only Admin Create Users", 400);
            }
        } catch (error: any) {
            throw new Error(`Error while Verifying`);
        }
    }

    //Middleware function for verifying user
    public async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.sendError(null, "Invalid authorization header", 400);
            }
            const token = authHeader.split(' ')[1];
            const decoded: any = await verifyToken(token);
            if (decoded.name) {
                req.user = {
                    _id: decoded._id,
                    name: decoded.name
                }
                next();
            }
        } catch (error: any) {
            throw new Error(`Error while Verifying`);
        }
    }

    //Middleware function for verifying login
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, password } = req.body;
            if (!name || !password) {
                return res.sendError(null, "Invalid fields", 400);
            }
            next();
        } catch (e: any) {
            throw new Error(`Error while logging user ${e}`);
        }
    }
    //Middleware function for verifying signin
    public async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, password, email, role } = req.body;
            if (!name || !password || !email || !role) {
                return res.sendError(null, "Invalid fields", 400);
            }
            next();
        } catch (e: any) {
            throw new Error(`Error while signing user ${e}`);
        }
    }

    //Middleware function for deleting user
    public async deleteId(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.sendError(null, "Id for object not send", 400);
            }
            next();
        } catch (error) {
            return res.sendError(error, "Error while sending id", 500);
        }
    }

    //Middleware function for verifying seller
    public async verifySeller(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.sendError(null, "Invalid authorization header", 400);
            }

            const token = authHeader.split(' ')[1];
            const decoded: any = await verifyToken(token);

            if (decoded.role === "SELLER") {
                req.user = {
                    _id: decoded._id,
                    name: decoded.name,
                };
                next();
            } else {
                return res.sendError(null, "Only sellers can access this resource", 403);
            }
        } catch (error) {
            return res.sendError(error, "Error verifying seller", 500);
        }
    }

    //Middleware function for verifying Bidder
    public async verifyBidder(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.sendError(null, "Invalid authorization header", 400);
            }

            const token = authHeader.split(' ')[1];
            const decoded: any = await verifyToken(token);

            if (decoded.role === "BIDDER") {
                req.user = {
                    _id: decoded._id,
                    name: decoded.name,
                };
                next();
            } else {
                return res.sendError(null, "Only bidders can access this resource", 403);
            }
        } catch (error) {
            return res.sendError(error, "Error verifying bidder", 500);
        }
    }


}
export default UserMiddleware;

import { Request, Response, NextFunction } from "express";

class CategoryMiddleware{
    constructor(){}
    public async createCategory(req : Request, res : Response,next : NextFunction){
        try {
            const { name } = req.body;
            if(!name){
                return res.sendError(null,"Category name is required",400);
            } 
            next();
        } catch (error : any) {
            return res.sendError(error.message,"An unexpected error occurred",500);
        }
    }
    public async getCategory(req : Request, res : Response,next : NextFunction){
        try {
            const { name } = req.params;
            if(!name){
                return res.sendError(null,"Category Name is required",400);
            }
            next();
        } catch (error : any) {
            return res.sendError(error.message, "An unexpected error occurred",500);
        }
    }
}

export default CategoryMiddleware;
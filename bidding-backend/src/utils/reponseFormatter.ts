import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";


// Define a standard response shape for all API responses.
interface ResponseFormat {
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}

// Utility to format an object response.
export const formatResponse = (
  success: boolean,
  data: any = null,
  message: string = "",
  error: any = null
): ResponseFormat => {
  var data = { ...data };
  return {
    success,
    data,
    message,
    error,
  };
};

// Utility to format an array response (optional separation for clarity).
export const formatArrayResponse = (
  success: boolean,
  data: any = null,
  message: string = "",
  error: any = null
): ResponseFormat => {
  return {
    success,
    data,
    message,
    error,
  };
};

// Extend Express Request and Response types to include custom helpers and user info.
declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string,
        _id: mongoose.Schema.Types.ObjectId
      }
    }
    interface Response {
      sendFormatted: (data: any, message?: string, status?: number) => void;
      sendArrayFormatted: (
        data: any,
        message?: string,
        status?: number
      ) => void;
      sendError: (error: any, message?: string, status?: number) => void;
    }
  }
}


// Express middleware to attach custom response helpers for consistent API output.
export const responseFormatter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendFormatted = (
    data: any,
    message: string = "",
    status: number = 200
  ) => {
    res.status(status).json(formatResponse(true, data, message));
  };
  res.sendArrayFormatted = (
    data: any,
    message: string = "",
    status: number = 200
  ) => {
    res.status(status).json(formatArrayResponse(true, data, message));
  };

  res.sendError = (error: any, message: string = "", status: number = 500) => {
    res.status(status).json(formatResponse(false, null, message, error));
  };

  next();
};
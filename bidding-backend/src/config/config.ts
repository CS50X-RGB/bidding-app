import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/po-tracking';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "rohanchatterjee866@gmail.com";
export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASS = process.env.ADMIN_PASS || "admin";
export const EXPIRE_TIME : string | number = process.env.EXPIRE_TIME || "24h";
export const SECRET_KEY : string = process.env.SECRET_KEY || "po-tracking";
export const AWS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_BUCKET = process.env.AWS_BUCKET_NAME;

if (!AWS_KEY_ID) throw new Error("Missing AWS_ACCESS_KEY_ID in env");
if (!AWS_SECRET_KEY) throw new Error("Missing AWS_SECRET_ACCESS_KEY in env");
if (!AWS_REGION) throw new Error("Missing AWS_REGION in env");
if (!AWS_BUCKET) throw new Error("Missing AWS_BUCKET_NAME in env");
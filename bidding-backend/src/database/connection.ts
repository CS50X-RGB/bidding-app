import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/config';


//This function is used to connect the backend with database
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

export default connectDB;

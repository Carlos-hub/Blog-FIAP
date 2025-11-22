import mongoose from "mongoose";

export default function connectToMongoDB() {
    mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
    mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });
    mongoose.connection.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });
    return mongoose.connection;
}
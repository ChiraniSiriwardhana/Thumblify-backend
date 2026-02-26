import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
            console.log("Database:", mongoose.connection.db?.databaseName);
            isConnected = true;
        });
        
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            isConnected = false;
        });
        
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
            isConnected = false;
        });

        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB connection successful");
        isConnected = true;

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        isConnected = false;
        throw error; // Throw instead of exit for serverless
    }
}

export default connectDB;
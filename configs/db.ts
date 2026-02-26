import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
            console.log("Database:", mongoose.connection.db?.databaseName);
        });
        
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });
        
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB connection successful");

    }
    catch (error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;
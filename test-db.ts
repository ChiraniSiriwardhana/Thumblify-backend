import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";

async function testDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected!");
        console.log("Database name:", mongoose.connection.db?.databaseName);
        
        // Try to create and save a test user
        const testUser = new User({
            name: "Test User",
            email: `test_${Date.now()}@example.com`,
            password: "hashedpassword123"
        });
        
        console.log("Saving test user...");
        const saved = await testUser.save();
        console.log("User saved successfully!");
        console.log("User ID:", saved._id);
        console.log("User details:", saved);
        
        // Verify it's in the database
        const found = await User.findById(saved._id);
        console.log("Found user in DB:", found);
        
        // Count users
        const count = await User.countDocuments();
        console.log("Total users in database:", count);
        
        // Clean up test user
        await User.findByIdAndDelete(saved._id);
        console.log("Test user deleted");
        
        await mongoose.connection.close();
        console.log("Connection closed");
        
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

testDB();

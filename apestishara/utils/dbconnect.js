import mongoose from "mongoose";

const uri = process.env.MONGO_URL;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected to database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default connectDB;
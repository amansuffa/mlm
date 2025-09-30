import mongoose from "mongoose";
import { seedEmailTemplates } from "./seedTemplates";
const MONGODB_URI = process.env.MONGODB_URI ;

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    await seedEmailTemplates();
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

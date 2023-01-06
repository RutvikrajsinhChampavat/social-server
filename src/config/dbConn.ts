import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.DATABASE_URI as string);
  } catch (error: any) {
    console.log(error.message);
  }
};

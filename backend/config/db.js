import mongoose from "mongoose";

const connectDB = async () => {
mongoose.connection.on("connected", () => {
  console.log(">>> ACTUAL CONNECTED DB NAME:", mongoose.connection.name);
});

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("🔴 MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;


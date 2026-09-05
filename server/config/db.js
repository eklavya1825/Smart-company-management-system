const mongoose = require("mongoose");

// Tracks whether MongoDB is actually connected.
// The rest of the app checks this flag to decide whether to
// use the real database or fall back to demo mode.
let isConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scms";

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000, // fail fast instead of hanging
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    isConnected = false;
    console.warn("⚠️  MongoDB connection failed. Starting in DEMO MODE.");
    console.warn(`   Reason: ${error.message}`);
    console.warn(
      "   The API will serve mock/demo data so the app can still be shown."
    );
  }
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };

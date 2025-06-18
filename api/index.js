import { createServer } from "../server/server.js";
import mongoose from "mongoose";

export default async function handler(request, response) {
  try {
    if (mongoose.connection.readyState !== 1) {
      try {
        await mongoose.connect(process.env.MONGO_CONNECTION);
        console.log("MongoDB connected successfully in serverless function");
      } catch (mongoError) {
        console.error("MongoDB connection error:", mongoError);
        return response.status(500).json({
          status: "error",
          message: "Database connection failed"
        });
      }
    }
    
    const server = createServer();
    await server.ready();
    
    server.server.emit("request", request, response);
  } catch (error) {
    console.error("Server error:", error);
    return response.status(500).json({
      status: "error",
      message: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
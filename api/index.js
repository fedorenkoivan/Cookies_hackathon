import { createServer } from "../server/server.js";
import mongoose from "mongoose";

export default async function handler(request, response) {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGO_CONNECTION);
      console.log("MongoDB connected in serverless function");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      return response.status(500).json({
        status: "error",
        message: "Database connection failed"
      });
    }
  }
  
  const server = createServer();
  await server.ready();
  
  server.server.emit("request", request, response);
}
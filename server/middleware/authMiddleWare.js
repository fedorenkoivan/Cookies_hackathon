import { verifyJwtToken } from "../utils/authUtils.js";
import mongoose from "mongoose";

export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    const accessToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!accessToken) {
      return reply.code(401).send({
        status: "error",
        message: "You are not logged in. Please log in to get access.",
      });
    }

    const decoded = verifyJwtToken(accessToken, "access_token");
    
    try {
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        throw new Error('Invalid ID format in token');
      }
      
      request.user = { id: decoded.id };
    } catch (idError) {
      console.error("ID format error:", idError.message);
      return reply.code(401).send({
        status: "error",
        message: "Invalid user identification. Please log in again.",
      });
    }
    
    return;
  } catch (err) {
    console.error("Token verification error:", err.message);
    return reply.code(401).send({
      status: "error",
      message: "Invalid token or token expired",
    });
  }
};

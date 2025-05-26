import { verifyJwtToken } from "../utils/authUtils.js";
import mongoose from "mongoose";
import { createError } from "../utils/errorUtils.js";

export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    const accessToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!accessToken) {
      throw createError("UNAUTHORIZED", "You are not logged in. Please log in to get access.");
    }

    const decoded = verifyJwtToken(accessToken, "access_token");
    
    try {
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        throw new Error('Invalid ID format in token');
      }
      
      request.user = { id: decoded.id };
    } catch (idError) {
      console.error("ID format error:", idError.message);
      throw createError("UNAUTHORIZED", "Invalid user identification. Please log in again.");
    }
    
    return;
  } catch (err) {
    console.error("Token verification error:", err.message);
    throw createError("UNAUTHORIZED", "Invalid token or token expired");
  }
};

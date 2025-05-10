import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const createAccessToken = (userId) => {
  // Ensure we have a string representation of the ObjectId
  const idStr = userId.toString();
  return jwt.sign(
    {
      id: idStr,
      scope: "access_token",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      subject: idStr,
    },
  );
};

export const createRefreshToken = (userId) => {
  // Ensure we have a string representation of the ObjectId
  const idStr = userId.toString();
  return jwt.sign(
    {
      id: idStr,
      scope: "refresh_token",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      subject: idStr,
    },
  );
};

export const handleTokens = async (userId, reply, options = {}) => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  await User.findByIdAndUpdate(
    userId,
    { refreshToken },
    { validateBeforeSave: false },
  );

  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (croissants)
    path: "/",
    sameSite: "lax",
  };
  const cookieOptions = { ...defaultOptions, ...options };

  reply.setCookie("refreshToken", refreshToken, cookieOptions);

  return accessToken;
};

export const clearRefreshTokenCookie = (reply, options = {}) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  const cookieOptions = { ...defaultOptions, ...options };

  reply.clearCookie("refreshToken", cookieOptions);
};

export const verifyJwtToken = (token, expectedScope) => {
  if (!token) {
    throw new Error("Token not found");
  }

  const secret = process.env.JWT_SECRET;
  const decoded = jwt.verify(token, secret);

  if (decoded.scope !== expectedScope) {
    throw new Error(`Invalid token type. Expected: ${expectedScope}`);
  }

  return decoded;
};

import {
  createAccessToken,
  createRefreshToken,
} from "../utils/createTokens.js";
import User from "../models/userModel.js";

export const handleTokens = async (server, userId, reply, options = {}) => {
  const accessToken = createAccessToken(server, userId);
  const refreshToken = createRefreshToken(server, userId);

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

// export const verifyRefreshToken = (server, refreshToken) => {
//   if (!refreshToken) {
//     throw new Error('Refresh token not found');
//   }
//   //'Refresh token not found' - > norm?

//   const decoded = server.jwt.verify(refreshToken);

//   if (decoded.scope !== 'refresh_token') {
//     throw new Error('Invalid token type');
//   }

//   return decoded;
// };

export const verifyJwtToken = (server, token, expectedScope) => {
  if (!token) {
    throw new Error("Token not found");
  }
  //maybe concrete access or refresh?

  const decoded = server.jwt.verify(token);

  if (decoded.scope !== expectedScope) {
    throw new Error(`Invalid token type. Expected: ${expectedScope}`);
  }

  return decoded;
};

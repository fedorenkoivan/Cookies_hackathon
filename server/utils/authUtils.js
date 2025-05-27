import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const defaultOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
  sameSite: "lax",
};

export const validateLoginInput = (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    return {
      isInputValid: false,
      inputErrorMsg: "Please provide email and password!",
      inputCode: 400,
    };
  }
  return {
    isInputValid: true,
    credErrorMsg: null,
    inputCode: 200,
  };
};

export const validateCredentails = async (credentials) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return {
      isCredValid: false,
      credErrorMsg: "Incorrect email or password",
      credCode: 401,
    };
  }

  const isValidPassword = await user.correctPassword(password, user.password);
  if (!isValidPassword) {
    return {
      isCredValid: false,
      credErrorMsg: "Incorrect email or password",
      credCode: 401,
    };
  }

  return {
    isCredValid: true,
    user,
    credErrorMsg: null,
    credCode: 200,
  };
};

export const createAccessToken = (userId) => {
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
    }
  );
};

export const createRefreshToken = (userId) => {
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
    }
  );
};

export const handleTokens = async (userId, reply, options = {}) => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  await User.findByIdAndUpdate(
    userId,
    { refreshToken },
    { validateBeforeSave: false }
  );

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

export const hashPassword = async (password) => {
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32,
  });
  return hashedPassword;
};

export const emailMarkup = (username, resetURL) => {
  const message = `
            Forgot your password? Submit a request with your new password to: ${resetURL}.
            If you didn't forget your password, please ignore this email.
          `;

  const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1d2671;">Password Reset</h2>
              <p>Hello ${username},</p>
              <p>Forgot your password? Click the button below to reset it:</p>
              <a href="${resetURL}" style="display: inline-block; background: linear-gradient(135deg, #1d2671, #c33764); color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">Reset Your Password</a>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p>This link will expire in 10 minutes.</p>
              <p>Best regards,<br>The Cookies Team 🍪</p>
            </div>
          `;

  return { message, html };
};

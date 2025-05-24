import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import argon2 from 'argon2'
import nodemailer from 'nodemailer';

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

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Cookies Reset Password <noreply@cookiesquest.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
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
    },
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
        hashLength: 32
    });
    return hashedPassword;
};

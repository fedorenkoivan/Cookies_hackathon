import {
  validateLoginInput,
  validateCredentails,
} from "../utils/authValidation.js";

import {
  handleTokens,
  clearRefreshTokenCookie,
  verifyJwtToken,
} from "../utils/handleTokens.js";

import { createRefreshToken } from "../utils/handleTokens.js";

import { sendEmail } from "../utils/email.js";
import argon2 from "argon2";

import { getProfile } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleWare.js";
import User from "../models/userModel.js";

export default async function userRoutes(fastify) {
  fastify.post("/signup", async (request, reply) => {
    const { name, email, password, passwordConfirm } = request.body;

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const accessToken = await handleTokens(newUser._id, reply);

    reply.code(201).send({
      status: "success",
      accessToken,
      data: {
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      },
    });
  });

  fastify.post("/login", async (request, reply) => {
    const { isInputValid, inputErrorMsg, inputCode } = validateLoginInput(
      request.body,
    );
    if (!isInputValid) {
      return reply.code(inputCode).send({
        status: "error",
        message: inputErrorMsg,
      });
    }

    const { isCredValid, user, credErrorMsg, credCode } =
      await validateCredentails(request.body);
    if (!isCredValid) {
      return reply.code(credCode).send({
        status: "error",
        message: credErrorMsg,
      });
    }
    const accessToken = await handleTokens(user._id, reply);

    reply.code(200).send({ status: "success", accessToken });
  });

  fastify.post("/logout", async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;

    clearRefreshTokenCookie(reply);

    if (refreshToken) {
      try {
        const decoded = verifyJwtToken(refreshToken, "refresh_token");

        if (decoded?.id) {
          await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
        }
      } catch (tokenErr) {
        console.log("Invalid token during logout:", tokenErr.message);
      }
    }
    reply
      .code(200)
      .send({ status: "success", message: "Logged out successfully" });
  });

  fastify.get(
    "/profile",
    {
      preHandler: async (request, reply) => {
        await verifyToken(request, reply);
      },
    },
    async (request, reply) => {
      return getProfile(request, reply);
    },
  );

  fastify.post("/forgot-password", async (request, reply) => {
        const { email } = request.body;

        if (!email) {
          return reply.code(400).send({
            status: "error",
            message: "Please provide your email",
          });
        }

        const user = await User.findOne({ email });

        if (!user) {
          return reply.code(404).send({
            status: "error",
            message: "No user found with that email address",
          });
        }

        const resetToken = await user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetURL = `${request.headers.origin}/reset-password/${resetToken}`;

        const message = `
          Forgot your password? Submit a request with your new password to: ${resetURL}.
          If you didn't forget your password, please ignore this email.
        `;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1d2671;">Password Reset</h2>
            <p>Hello ${user.name},</p>
            <p>Forgot your password? Click the button below to reset it:</p>
            <a href="${resetURL}" style="display: inline-block; background: linear-gradient(135deg, #1d2671, #c33764); color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">Reset Your Password</a>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>This link will expire in 10 minutes.</p>
            <p>Best regards,<br>The Cookies Team 🍪</p>
          </div>
        `;

        try {
          await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message,
            html,
          });

          reply.code(200).send({ status: "success", message: "Token sent to email" });
        } catch (err) {
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          await user.save({ validateBeforeSave: false });

          return reply.code(500).send({
            status: "error",
            message: "There was an error sending the email. Try again later.",
          });
    }
  });

  fastify.post("/reset-password/:resetToken", async (request, reply) => {
        const { resetToken } = request.params;
        const { password, passwordConfirm } = request.body;

        const users = await User.find({
          passwordResetExpires: { $gt: Date.now() },
        });

        let user = null;

        for (const potentialUser of users) {
          try {
            const isValidToken = await argon2.verify(
              potentialUser.passwordResetToken,
              resetToken,
            );

            if (isValidToken) {
              user = potentialUser;
              break;
            }
          } catch (err) {
            continue; // skip to the next user if verification fails
          }
        }

        if (!user) {
          return reply.code(400).send({
            status: "error",
            message: "Token is invalid or has expired",
          });
        }
        
        user.password = password;
        user.passwordConfirm = passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;    
        await user.save();

        const accessToken = await handleTokens(user._id, reply);
        const refreshToken = createRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        reply.setCookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: "/",
          sameSite: "lax"
        });

        reply.code(200).send({ status: "success", accessToken });
  });

  fastify.post("/refresh", async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;

    let decoded;
    try {
      decoded = verifyJwtToken(refreshToken, "refresh_token");
    } catch (err) {
      return reply
        .code(401)
        .send({ status: "error", message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user) {
      return reply
        .code(401)
        .send({ status: "error", message: "User not found" });
    }

    const accessToken = await handleTokens(user._id, reply);
    reply.code(200).send({ status: "success", accessToken });
  });
}

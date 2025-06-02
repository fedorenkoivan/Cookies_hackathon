import {
  validateLoginInput,
  validateCredentails,
  createRefreshToken,
  handleTokens,
  clearRefreshTokenCookie,
  verifyJwtToken,
  defaultOptions,
  emailMarkup,
} from "../utils/authUtils.js";
import { sendEmail } from "../utils/sendEmailProxy.js";

import argon2 from "argon2";

import { verifyToken } from "../middleware/authMiddleWare.js";
import { logRoute } from "../middleware/loggerMiddleware.js";
import { User } from "../models/userModel.js";
import { HttpError, createError } from "../utils/errorUtils.js";

export default async function userRoutes(fastify) {
  fastify.post(
    "/signup",
    { preHandler: logRoute("register") },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const newUser = await User.create({
        name,
        email,
        password,
      });

      const accessToken = await handleTokens(newUser._id, reply);

      reply.code(201).send({
        status: "success",
        accessToken,
        data: {
          user: { id: newUser._id, name: newUser.name, email: newUser.email },
        },
      });
    }
  );

  fastify.post(
    "/login",
    { preHandler: logRoute("login") },
    async (request, reply) => {
      const { isInputValid, inputErrorMsg, inputCode } = validateLoginInput(
        request.body
      );
      if (!isInputValid) {
        throw HttpError.createFromStatusCode(inputCode, inputErrorMsg);
      }

      const { isCredValid, user, credErrorMsg, credCode } =
        await validateCredentails(request.body);
      if (!isCredValid) {
        throw HttpError.createFromStatusCode(credCode, credErrorMsg);
      }
      const accessToken = await handleTokens(user._id, reply);

      reply.code(200).send({ status: "success", accessToken });
    }
  );

  fastify.post(
    "/logout",
    { preHandler: logRoute("logout") },
    async (request, reply) => {
      const refreshToken = request.cookies.refreshToken;

      clearRefreshTokenCookie(reply);

      if (refreshToken) {
        try {
          const decoded = verifyJwtToken(refreshToken, "refresh_token");

          if (decoded?.id) {
            await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
          }
        } catch (tokenErr) {
          console.error("Invalid token during logout:", tokenErr.message);
        }
      }
      reply
        .code(200)
        .send({ status: "success", message: "Logged out successfully" });
    }
  );

  fastify.get(
    "/profile",
    {
      preHandler: async (request, reply) => {
        await verifyToken(request, reply);
        await logRoute("profile")(request, reply);
      },
    },
    async (request, reply) => {
      const userId = request.user.id;

      const user = await User.findById(userId);

      if (!user) {
        throw createError(404, "User not found");
      }

      return reply.code(200).send({
        status: "success",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      });
    }
  );

  fastify.get(
    "/public-profile/:userId",
    {
      preHandler: async (request, reply) => {
        await logRoute("profile")(request, reply);
      },
    },
    async (request, reply) => {
      const userId = request.params.userId;

      const user = await User.findById(userId);

      if (!user) {
        throw createError(404, "User not found");
      }

      return reply.code(200).send({
        status: "success",
        data: {
          user: {
            id: user._id,
            name: user.name,
            // image: user.image,
          },
        },
      });
    }
  );

  fastify.post(
    "/forgot-password",
    { preHandler: logRoute("forgot_password") },
    async (request, reply) => {
      const { email } = request.body;

      if (!email) {
        throw createError("BAD_REQUEST", "Please provide your email");
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw createError("NOT_FOUND", "No user found with that email address");
      }

      const resetToken = await user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      const resetURL = `${request.headers.origin}/reset-password/${resetToken}`;

      const { message, html } = emailMarkup(user.name, resetURL);

      try {
        await sendEmail({
          email: user.email,
          subject: "Your password reset token (valid for 10 min)",
          message,
          html,
        });

        reply
          .code(200)
          .send({ status: "success", message: "Token sent to email" });
      } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        throw createError(
          "INTERNAL_SERVER_ERROR",
          "There was an error sending the email. Try again later."
        );
      }
    }
  );

  fastify.post(
    "/reset-password/:resetToken",
    { preHandler: logRoute("reset_password") },
    async (request, reply) => {
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
            resetToken
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
        throw createError("BAD_REQUEST", "Token is invalid or has expired");
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

      reply.setCookie("refreshToken", refreshToken, defaultOptions);

      reply.code(200).send({ status: "success", accessToken });
    }
  );

  fastify.post(
    "/refresh",
    { preHandler: logRoute("token_refresh") },
    async (request, reply) => {
      const refreshToken = request.cookies.refreshToken;

      let decoded;
      try {
        decoded = verifyJwtToken(refreshToken, "refresh_token");
      } catch (err) {
        throw createError("UNAUTHORIZED", "Invalid or expired token");
      }

      const user = await User.findById(decoded.id).select("+refreshToken");
      if (!user) {
        throw createError("UNAUTHORIZED", "User not found");
      }

      const accessToken = await handleTokens(user._id, reply);
      reply.code(200).send({ status: "success", accessToken });
    }
  );
}

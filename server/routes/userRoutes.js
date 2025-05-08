import {
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import {
  validateLoginInput,
  validateCredentails,
} from "../utils/authValidation.js";

import {
  handleTokens,
  clearRefreshTokenCookie,
  verifyJwtToken,
} from "../utils/handleTokens.js";

import { createAccessToken } from "../utils/createTokens.js";
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

    const accessToken = await handleTokens(request.server, newUser._id, reply);

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

    const accessToken = await handleTokens(request.server, user._id, reply);

    reply.code(200).send({ status: "success", accessToken });
  });

  fastify.post("/logout", async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;

    clearRefreshTokenCookie(reply);

    if (refreshToken) {
      try {
        const decoded = request.server.jwt.verify(refreshToken);

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
        console.log("Profile route hit before middleware");
        await verifyToken(request, reply);
        console.log("Middleware passed successfully");
      },
    },
    async (request, reply) => {
      console.log("Profile handler executing");
      return getProfile(request, reply);
    },
  );

  fastify.post("/forgot-password", async (request, reply) => {
    return forgotPassword(request, reply);
  });

  fastify.post("/reset-password/:resetToken", async (request, reply) => {
    return resetPassword(request, reply);
  });

  fastify.post("/refresh", async (request, reply) => {
    const refreshToken = request.cookies.refreshToken;

    try {
      const decoded = verifyJwtToken(
        request.server,
        refreshToken,
        "refresh_token",
      );

      const user = await User.findById(decoded.id).select("+refreshToken");
      if (!user) {
        return reply
          .code(401)
          .send({ status: "error", message: "User not found" });
      }

      // maybe update refresh too?
      const accessToken = createAccessToken(request.server, user._id);

      reply.code(200).send({ status: "success", accessToken });
    } catch (err) {
      return reply
        .code(401)
        .send({ status: "error", message: "Invalid or expired token" });
    }
  });
}

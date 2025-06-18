import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fastifyMultipart from "@fastify/multipart";
import userRoutes from "./routes/userRoutes.js";
import questRoutes from "./routes/questRoutes.js";
import { HttpError, ErrorType, createError } from "./utils/errorUtils.js";
import progressRoutes from "./routes/progressRoutes.js";
import { create } from "domain";

dotenv.config({ path: "../.env" });

export function createServer() {
  const fastify = Fastify({
    logger: true,
    bodyLimit: 10 * 1024 * 1024,
  });

  fastify.setErrorHandler((error, request, reply) => {
    console.error("Error handler caught:", error);

    let httpError;

    if (error.name === "HttpError") {
      httpError = error;
    } else if (error.statusCode && error.validation) {
      httpError = createError("BAD_REQUEST", "Validation Error", {
        validation: error.validation,
      });
    } else if (
      error.name === "DocumentNotFoundError" ||
      error.name === "CastError" ||
      error.name === "MongoError" ||
      error.name === "ValidationError"
    ) {
      httpError = HttpError.fromDatabaseError(error);
    } else {
      const statusCode = error.statusCode ?? 500;
      httpError = HttpError.createFromStatusCode(
        statusCode,
        error.message || "Internal Server Error"
      );
    }

    fastify.log.error(httpError.toLog());

    return reply.code(httpError.statusCode).send(httpError.toHttp());
  });

  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    hook: "onRequest",
  });

  fastify.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  fastify.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100000,
      fields: 10,
      fileSize: 5000000, // 5MB max file size
      files: 1, // Allow only 1 file upload at a time
      headerPairs: 2000,
    },
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });

  fastify.register(userRoutes, { prefix: "/users" });
  fastify.register(questRoutes, { prefix: "/quests" });
  fastify.register(progressRoutes, { prefix: "/progress" });

  return fastify;
}

if (process.env.NODE_ENV !== "production") {
  try {
    mongoose
      .connect(process.env.MONGO_CONNECTION)
      .then(() => console.log("Successfully connected to database"));

    const server = createServer();
    const PORT = 5000;
    server.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

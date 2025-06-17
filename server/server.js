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

dotenv.config({ path: "../.env" });

await mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Successfully connected to database"));

const fastify = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024,
});
const PORT = 5000;

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
      error.message || "Internal Server Error",
    );
  }

  fastify.log.error(httpError.toLog());

  return reply.code(httpError.statusCode).send(httpError.toHttp());
});

await fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "onRequest",
});

await fastify.register(fastifyCors, {
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

await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});

fastify.register(userRoutes, { prefix: "/users" });
fastify.register(questRoutes, { prefix: "/quests" });
fastify.register(progressRoutes, { prefix: "/progress" });

try {
  fastify.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Server running on port ${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

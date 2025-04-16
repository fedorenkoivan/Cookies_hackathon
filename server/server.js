import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import questRoutes from "./routes/questRoutes.js";

dotenv.config({ path: "../.env" });

await mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Successfully connected to database"));

const fastify = Fastify({
  logger: true,
});
const PORT = 5000;

await fastify.register(fastifyCors, {
  origin: true,
});

fastify.register(userRoutes, { prefix: "/users" });
fastify.register(questRoutes, { prefix: "/quests" });

try {
  fastify.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Server running on port ${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

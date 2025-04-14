import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import questRoutes from './routes/questRoutes.js';

dotenv.config({ path: "../.env" });

await mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Successfully connected to database"))

const fastify = Fastify({
  logger: true
});
const PORT = 5000;

await fastify.register(fastifyCors, { 
  origin: true
});

await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
});

fastify.register(userRoutes, { prefix: '/users' });
fastify.register(questRoutes, { prefix: '/quests' });

try {
    fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running on port ${PORT}`);
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import questRoutes from './routes/questRoutes.js';

dotenv.config({ path: "../.env" });

await mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Successfully connected to database"));

const fastify = Fastify({
  logger: true,
});
const PORT = 5000;

fastify.setErrorHandler((error, request, reply) => {
  // викликати хттп
  if (error.name === 'DocumentNotFoundError' || error.message === 'User not found') {
    return reply.code(404).send({
      status: 'error',
      message: 'User not found'
    });
  }
  
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return reply.code(400).send({
      status: 'error',
      message: 'Invalid ID format'
    });
  }
  
  if (error.name === 'MongoError' || error.name === 'ValidationError') {
    return reply.code(400).send({
      status: 'error',
      message: error.message
    });
  }
  
  const statusCode = error.statusCode || 500;
  
  fastify.log.error(error);
  return reply.code(statusCode).send({
    status: 'error',
    message: error.message || 'Internal Server Error'
  });
});

await fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
  hook: 'onRequest',
});

await fastify.register(fastifyCors, {
  origin: true,
  credentials: true,
});

await fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
});

fastify.register(userRoutes, { prefix: '/users' });
fastify.register(questRoutes, { prefix: '/quests' });

try {
  fastify.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Server running on port ${PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

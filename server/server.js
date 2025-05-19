import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import questRoutes from './routes/questRoutes.js';
import { ErrorType } from './utils/errorUtils.js';

dotenv.config({ path: "../.env" });

await mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Successfully connected to database"));

const fastify = Fastify({
  logger: true,
  bodyLimit: 10 * 1024 * 1024
});
const PORT = 5000;

// fastify.setErrorHandler((error, request, reply) => {
//   console.error("Error handler caught:", error);
//   // викликати хттп, errorUtils must be class
//   if (error.name === 'DocumentNotFoundError' || error.message === 'User not found') {
//     return reply.code(404).send({
//       status: 'error',
//       message: 'Not found'
//     });
//   }
  
//   if (error.name === 'CastError' && error.kind === 'ObjectId') {
//     return reply.code(400).send({
//       status: 'error',
//       message: 'Invalid ID format'
//     });
//   }
  
//   if (error.name === 'MongoError' || error.name === 'ValidationError') {
//     return reply.code(400).send({
//       status: 'error',
//       message: error.message
//     });
//   }
  
//   const statusCode = error.statusCode || 500;
  
//   fastify.log.error(error);
//   return reply.code(statusCode).send({
//     status: 'error',
//     message: error.message || 'Internal Server Error'
//   });
// });

fastify.setErrorHandler((error, request, reply) => {
  console.error("Error handler caught:", error);
  
  let httpError;
  
  if (error instanceof ErrorType) {
    httpError = error;
  } else if (error.statusCode && error.validation) {
    httpError = ErrorType('BAD_REQUEST', 'Validation Error', { 
      validation: error.validation 
    });
  } else if (error.name === 'DocumentNotFoundError' || 
             error.name === 'CastError' || 
             error.name === 'MongoError' || 
             error.name === 'ValidationError') {
    httpError = ErrorType.fromDatabaseError(error);
  } else {
    const statusCode = error.statusCode ?? 500;
    httpError = ErrorType.createFromStatusCode(statusCode, error.message || 'Internal Server Error');
  }
  
  fastify.log.error(httpError.toLog());
  
  return reply.code(httpError.statusCode).send(httpError.toHttp());
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

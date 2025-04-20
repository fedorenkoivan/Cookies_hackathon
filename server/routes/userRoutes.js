import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import { getProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleWare.js';

export default async function userRoutes(fastify) {
  fastify.post('/signup', async (request, reply) => {
    return signup(request, reply);
  });
  
  fastify.post('/login', async (request, reply) => {
    return login(request, reply);
  });

  fastify.get('/profile', { preHandler: verifyToken }, async (request, reply) => {
    return getProfile(request, reply);
  });
  
  fastify.post('/forgot-password', async (request, reply) => {
    return forgotPassword(request, reply);
  });
  
  fastify.post('/reset-password/:token', async (request, reply) => {
    return resetPassword(request, reply);
  });
}
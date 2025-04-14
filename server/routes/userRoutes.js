import { signup, login } from '../controllers/authController.js';
import { getProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleWare.js';

export default async function userRoutes(fastify) {
  fastify.post('/signup', async (request, reply) => {
    return signup(request, reply);
  });
  
  fastify.post('/login', async (request, reply) => {
    return login(request, reply);
  });

  fastify.get('/profile', {preHandler: verifyToken }, async (request, reply) => {
    return getProfile(request, reply);
  });
}
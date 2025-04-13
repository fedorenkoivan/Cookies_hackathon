import { signup, login } from '../controllers/authController.js';

export default async function userRoutes(fastify) {
  fastify.post('/signup', async (request, reply) => {
    return signup(request, reply);
  });
  
  fastify.post('/login', async (request, reply) => {
    return login(request, reply);
  });
}
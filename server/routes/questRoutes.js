import { getQuests, createQuest } from '../controllers/questController.js';
import { verifyToken } from '../middleware/authMiddleWare.js';

export default async function questRoutes(fastify) {
  fastify.get('/', async (request, reply) => {
    return getQuests(request.query, reply);
  });
  
  fastify.post('/create', { preHandler: verifyToken }, async (request, reply) => {
    return createQuest(request, reply);
  });
}
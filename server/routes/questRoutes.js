import { getQuests, createQuest } from '../controllers/questController.js';

export default async function questRoutes(fastify) {
  fastify.get('/', async (request, reply) => {
    return getQuests(request, reply);
  });
  
  fastify.post('/create', async (request, reply) => {
    console.log(request.body);
    return createQuest(request, reply);
  });
}
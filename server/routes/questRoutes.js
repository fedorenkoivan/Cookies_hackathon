import { questModel } from "../models/questModel.js";
import {
  checkLimit,
  checkFilters,
  checkSort,
} from "../utils/getQuestsUtils.js";
import { verifyToken } from "../middleware/authMiddleWare.js";
import { asyncMap } from "../utils/asyncMap.js";
import { compressImage } from "../utils/compressImage.js";

const getQuests = async (query) => {
  const limitValue = checkLimit(query.limit);
  const sort = checkSort(query.sort);
  const filters = checkFilters(query);
  const quests = await questModel.find(filters).sort(sort).limit(limitValue);
  return quests;
};

const createQuest = async (body) => {
  await asyncMap(body.questions, async (question) => {
    question.image = await compressImage(question.image);
  });
  body.image = await compressImage(body.image);
  const newQuest = await questModel.create(body);
  return newQuest;
};

export default async function questRoutes(fastify) {
  fastify.get("/", async (request, reply) => {
    return reply.code(200).send({
      status: "success",
      data: await getQuests(request.query),
    });
  });

  fastify.post(
    "/create",
    { preHandler: verifyToken },
    async (request, reply) => {
      return reply.code(201).send({
        status: "success",
        data: await createQuest(request.body),
      });
    }
  );
}

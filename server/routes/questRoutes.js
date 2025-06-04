import { questModel } from "../models/questModel.js";
import {
  checkLimit,
  checkFilters,
  checkSort,
} from "../utils/getUtils.js";
import {
  generateFakeQuestResults,
  validateRatingInput,
  recalculateAverageRating,
  findUserRatingIndex,
  getFormattedReviews,
} from "../utils/ratingUtils.js";
import { log } from "../utils/logger.js";
import { asyncMap } from "../utils/asyncMap.js";
import { compressImage } from "../utils/compressImage.js";
import { verifyToken } from "../middleware/authMiddleWare.js";

const getQuests = log({ category: "SYSTEM", funcName: "getQuests" })(
  async (query) => {
    const limitValue = checkLimit(query.limit);
    const sort = checkSort(query.sort);
    const filters = checkFilters(query);
    const quests = await questModel.find(filters).sort(sort).limit(limitValue);
    return quests;
  }
);

const createQuest = async (body) => {
  await asyncMap(body.questions, async (question) => {
    question.image = await compressImage(question.image);
  });
  body.image = await compressImage(body.image);
  const newQuest = await questModel.create(body);
  return newQuest;
};

const getQuestRatingInfo = async (questId, userId) => {
  const quest = await questModel.findById(questId);
  if (!quest) throw new Error("Quest not found");

  const userRatingIndex = findUserRatingIndex(quest.userRatings, userId);
  const userRating =
    userRatingIndex !== -1 ? quest.userRatings[userRatingIndex].rating : 0;

  const userComment =
    userRatingIndex !== -1
      ? quest.userRatings[userRatingIndex].comment || ""
      : "";

  // заглушка для справжніх даних, потім обробити
  const questResults = generateFakeQuestResults();

  return {
    questTitle: quest.title,
    questId: quest._id,
    userRating,
    userComment,
    score: questResults.score,
    totalTime: questResults.totalTime,
    avgTimePerQuestion: questResults.avgTimePerQuestion,
  };
};

export const updateRating = async (questId, userId, rating, comment) => {
  const numericRating = validateRatingInput(questId, userId, rating);

  const quest = await questModel.findById(questId);
  if (!quest) throw new Error("Quest not found");

  const existingRatingIndex = findUserRatingIndex(quest.userRatings, userId);

  let isUpdate = false;
  let oldRating = 0;

  const newRating = {
    userId,
    rating: numericRating,
    comment,
    date: new Date(),
  };

  if (existingRatingIndex !== -1) {
    isUpdate = true;
    oldRating = quest.userRatings[existingRatingIndex].rating;
    quest.userRatings[existingRatingIndex] = newRating;
  } else {
    quest.userRatings.push(newRating);
  }

  recalculateAverageRating(quest, oldRating, numericRating, isUpdate);

  await quest.save();

  return {
    rating: numericRating,
    comment,
    questRating: quest.rating,
    reviewsCount: quest.reviews,
    isUpdate,
  };
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

  fastify.get(
    "/:questId/rating",
    { preHandler: verifyToken },
    async (request, reply) => {
      const userId = request.user.id;
      const questId = request.params.questId;
      const ratingInfo = await getQuestRatingInfo(questId, userId);
      return reply.code(200).send(ratingInfo);
    }
  );

  fastify.post(
    "/:questId/rating",
    { preHandler: verifyToken },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) {
        return reply.code(401).send({
          status: "error",
          message: "Authentication failed: User ID is missing",
        });
      }

      const questId = request.params.questId;
      const { rating, comment } = request.body;

      const result = await updateRating(
        questId,
        userId,
        Number(rating),
        comment || ""
      );

      return reply.code(201).send({
        status: "success",
        data: result,
      });
    }
  );

  fastify.get("/:questId/reviews", async (request, reply) => {
    const questId = request.params.questId;

    const quest = await questModel.findById(questId);
    if (!quest) {
      return reply
        .code(404)
        .send({ status: "error", message: "Quest not found" });
    }

    const reviews = await getFormattedReviews(quest);
    return reply.code(200).send(reviews);
  });
}

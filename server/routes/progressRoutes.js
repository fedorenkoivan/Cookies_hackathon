import { progressModel } from "../models/progressModel.js";
import { checkFilters } from "../utils/getUtils.js";
import { log } from "../utils/logger.js";

export default async function progressRoutes(fastify) {
  fastify.post("/upsert", async (request, reply) => {
    const progress = await saveProgress(request.body);
    return reply.code(200).send({ success: true, data: progress });
  });

  fastify.get("/", async (request, reply) => {
    const history = await getHistory(request.query);
    return reply.code(200).send({ success: true, data: history });
  });

  fastify.delete("/", async (request, reply) => {
    await deleteHistory(request.query);
    return reply.code(200).send({ success: true });
  });
}

const deleteHistory = log({ category: "SYSTEM", funcName: "deleteHistory" })(async (query) => {
  const { id } = query;
  console.log("Attempting to delete ID:", id);

  if (!id) {
    return { success: false, error: "Missing id parameter" };
  }

  const result = await progressModel.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    return { success: false, error: "Progress not found" };
  }

  return { success: true };
});

const getHistory = log({ category: "SYSTEM", funcName: "getHistory" })(
  async (query) => {
    const filters = checkFilters(query);
    const history = await progressModel.find(filters);
    return history;
  }
);

const saveProgress = log({ category: "SYSTEM", funcName: "saveProgress" })(
  async (body) => {
    const {
      questId,
      userId,
      currentQuestionIndex,
      score,
      timeRemaining,
      isFinished,
    } = body;

    let progress = await progressModel.findOne({
      userId,
      questId,
      isFinished: false,
    });

    if (progress) {
      progress.currentQuestionIndex = currentQuestionIndex;
      progress.score = score;
      progress.timeRemaining = timeRemaining;
      progress.isFinished = isFinished;
      progress.lastActivityDate = Date.now();
    } else {
      progress = new progressModel({
        questId,
        userId,
        currentQuestionIndex,
        score,
        timeRemaining,
        isFinished,
        lastActivityDate: Date.now(),
      });
    }

    await progress.save();
    return progress;
  }
);

import { progressModel } from "../models/progressModel.js";

export default async function progressRoutes(fastify) {
  fastify.post("/upsert", async (request, reply) => {
    const {
      questId,
      userId,
      currentQuestionIndex,
      score,
      timeRemaining,
      isFinished,
    } = request.body;

    let progress = await progressModel.findOne({ userId, questId });

    if (progress) {
      progress.currentQuestionIndex = currentQuestionIndex;
      progress.score = score;
      progress.timeRemaining = timeRemaining;
      progress.isFinished = isFinished;
      progress.updatedAt = Date.now();
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
    return reply.code(200).send({ success: true, progress });
  });
}

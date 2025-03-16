import { questModel } from "../models/questModel.js";

const getBestQuests = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const topQuests = await questModel
      .find({
        createdAt: {
          $gte: today,
        },
      })
      .sort({
        rating: 1,
      })
      .limit(5);
    res.status(200).json({ status: "success", data: topQuests });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "failed",
        msg: "an error occurred while getting best quests",
      });
  }
};

const getAllQuests = async (req, res) => {
  try {
    const quests = await questModel.find();
    res.status(200).json({ status: "success", data: quests });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "failed",
        msg: "an error occurred while getting all quests",
      });
  }
};

export { getBestQuests, getAllQuests };

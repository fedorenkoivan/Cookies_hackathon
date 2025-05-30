import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  questId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  currentQuestionIndex: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  timeRemaining: {
    type: Number,
    required: true,
  },
  lastActivityDate: {
    type: Date,
    default: Date.now(),
  },
});

export const progressModel = mongoose.model("Progress", progressSchema);

import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    default: -1,
  },
  questions: {
    type: [
      {
        order: {
          type: Number,
        },
        value: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          default: "",
        },
        points: {
          type: Number,
          default: 0,
        },
        answers: {
          type: [
            {
              order: { type: Number, },
              value: { type: String, required: true },
              isCorrect: Boolean,
            },
          ],
          required: true,
        },
      },
    ],
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

questSchema.pre('save', async function(next) {
  this.title = this.title.toLowerCase().trim();
  next();
})

export const questModel = mongoose.model("Quest", questSchema);

import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    username: {
      type: String,
      required: true
    },
    authorId: {
      type: String, 
      required: true
    },
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
              order: { type: Number },
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
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userRatings: {
    type: [{
      userId: String,
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now }
    }],
    default: []
  }
});

questSchema.pre("save", async function (next) {
  this.title = this.title.toLowerCase().trim();
  next();
});

export const questModel = mongoose.model("Quest", questSchema);

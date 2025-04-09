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
  image: {
    type: String,
    default: "logo.jpg",
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

export const questModel = mongoose.model("Quest", questSchema);
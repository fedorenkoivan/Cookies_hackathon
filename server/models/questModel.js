import mongoose from "mongoose";

const questSchema = new mongoose.Schema({
  title: {
		type: String,
		required: [true, 'a quest must have a title'],
		unique: [true, 'a title must be unique']
	},
	author: {
		type: String,
		required: [true, 'a quest must have an author'],
	},
	description: {
		type: String,
		required: [true, 'a quest must have a description'],
	},
	category: {
		type: String,
		required: [true, 'a quest must have a category'],
	},
	time: {
		type: Number,
		default: -1
	},
	image: {
		type: String,
		default: 'logo.jpg'
	},
	rating: {
		type: Number
	}, 
	reviews: {
		type: Number,
		default: 0
	}
});

export const questModel = mongoose.model('Quest', questSchema);

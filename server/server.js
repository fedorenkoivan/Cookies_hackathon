import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { questModel } from "./models/questModel.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config({ path: "../.env" });
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

await mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Successfully connected to a database"));

// const newQuest = await questModel.create({
//   author: "Alice",
//   title: "Lost Treasure Hunt v2",
//   description:
//     "Find the hidden treasure in the ancient ruins before time runs out!",
//   category: "Adventure",
//   rating: 3.8,
// }).then((doc) => console.log(doc)).catch((err) => console.log(err));

app.use('/api/v1/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { questModel } from "./models/questModel.js";
import { logInModel } from "./models/LogIn.js";
import userRouter from "./routes/userRoutes.js";
import questRouter from "./routes/questRoutes.js";

dotenv.config({ path: "../.env" });
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

await mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Successfully connected to a database"));

app.use('/users', userRouter);
app.use('/quests', questRouter);

app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});

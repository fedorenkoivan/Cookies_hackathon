import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

await mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Successfully connected to a database"));

app.listen(PORT, () => {
  console.log(`Server runs on port ${PORT}`);
});

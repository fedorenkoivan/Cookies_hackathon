import express from "express";
import { createAllTable } from "./src/utils/dbUtils.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, async () => {
  console.log("Server running on port 3000");
  try {
    await createAllTable();
  } catch (error) {
    console.log("Failed to initialize the database", error);
  }
});

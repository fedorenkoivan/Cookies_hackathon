import express from "express";
import { getQuests } from "../controllers/questController.js"; 

const router = express.Router();

router.get('/', getQuests);

export default router;
import express from "express";
import { getQuests, createQuest } from "../controllers/questController.js"; 

const router = express.Router();

router.get('/', getQuests);
router.post('/create', createQuest);

export default router;
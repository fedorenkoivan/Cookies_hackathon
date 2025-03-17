import express from "express";
import { getBestQuests, getAllQuests, createQuest } from "../controllers/questController.js"; 

const router = express.Router();

router.get('/', getAllQuests);
router.get('/top-5', getBestQuests);

router.post('/create', createQuest);

export default router;
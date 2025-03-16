import express from "express";
import { getBestQuests, getAllQuests } from "../controllers/questController.js"; 

const router = express.Router();

router.get('/', getAllQuests);
router.get('/top-5', getBestQuests);

export default router;
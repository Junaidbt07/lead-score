import { Router } from "express";
import { triggerScoring } from "../controllers/scoreController";

const router = Router();

// @route   POST /api/score
router.post("/", triggerScoring);

export default router;

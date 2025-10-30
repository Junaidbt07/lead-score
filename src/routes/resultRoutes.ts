import { Router } from "express";
import { exportResults, getResults } from "../controllers/resultController";

const router = Router();

// @route   GET /api/results
router.get("/", getResults);

// @route   GET /api/results/export (BONUS)
router.get("/export", exportResults);

export default router;

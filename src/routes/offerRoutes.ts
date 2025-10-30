    import { Router } from "express";
import { createOrUpdateOffer } from "../controllers/offerController";

const router = Router();

// @route   POST /api/offer
router.post("/", createOrUpdateOffer);

export default router;

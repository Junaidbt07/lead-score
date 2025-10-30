import { Router } from "express";
import multer from "multer";
import { uploadLeads } from "../controllers/leadController";

const router = Router();

// Configure multer for in-memory file storage
// We use memoryStorage because Vercel (and other serverless envs)
// have a read-only filesystem. We must process the file from a buffer.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   POST /api/leads/upload
// 'file' is the field name Postman/frontend will use
router.post("/upload", upload.single("file"), uploadLeads);

export default router;

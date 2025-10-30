import { Request, Response } from "express";
import { runScoringPipeline } from "../services/scoreService";


export const triggerScoring = (req: Request, res: Response) => {
  try {
    // Immediately respond to the client
    res.status(202).json({
      message:
        "Scoring process initiated. This may take several minutes. Check GET /api/results for status.",
    });

  
    runScoringPipeline().catch((err) => {
      console.error("A critical error occurred in the scoring pipeline:", err);
    });
    
  } catch (error: any) {
    console.error("Error triggering scoring pipeline:", error.message);
    // This would catch synchronous errors in the setup, not in the pipeline itself
    res.status(500).json({ message: "Failed to initiate scoring" });
  }
};

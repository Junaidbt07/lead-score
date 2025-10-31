import { Request, Response } from "express";
import { runScoringPipeline } from "../services/scoreService";


export const triggerScoring = async (req: Request, res: Response) => {
  try {
    // --- THIS IS THE FIX ---
    // I am  now AWAITING the pipeline to finish.
    // This will hold the connection open and force Vercel to wait this fix i just tested when vercel is on cold start(free tier ).
    console.log("[Controller] Starting pipeline... (This may take a while)");
    await runScoringPipeline();
    console.log("[Controller] Pipeline finished.");

    // Now we respond with 200 (OK) because the job is done.
    res.status(200).json({
      message: "Scoring process complete.",
    });

  } catch (error: any) {
    console.error("Error triggering scoring pipeline:", error.message);
    res.status(500).json({ message: "Failed to run scoring pipeline" });
  }
};


import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";

// Import routes
import offerRoutes from "./routes/offerRoutes";
import leadRoutes from "./routes/leadRoutes";
import scoreRoutes from "./routes/scoreRoutes";
import resultRoutes from "./routes/resultRoutes";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---

app.use("/api/offer", offerRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/results", resultRoutes);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Lead Scoring Backend is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export the app for Vercel
export default app;

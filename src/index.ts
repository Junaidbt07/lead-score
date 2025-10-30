import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Import routes
// import offerRoutes from "./routes/offer";
// import leadsRoutes from "./routes/leads";
// import scoreRoutes from "./routes/score";
// import resultsRoutes from "./routes/results";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use("/offer", offerRoutes);
// app.use("/leads", leadsRoutes);
// app.use("/score", scoreRoutes);
// app.use("/results", resultsRoutes);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Lead Scoring Backend is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

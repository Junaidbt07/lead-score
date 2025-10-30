import { Request, Response } from "express";
import Lead from "../models/Lead";
import { ILead } from "../models/Lead";


export const getResults = async (req: Request, res: Response) => {
  try {
    const query = Lead.find();


    if (req.query.status !== "all") {
      query.where({ status: "scored" });
    }

  
    const leads = await query
      .select("name role company intent score reasoning status")
      .sort({ score: -1 });

    const totalLeads = await Lead.countDocuments();
    const scoredLeads = await Lead.countDocuments({ status: "scored" });
    const pendingLeads = await Lead.countDocuments({ status: "pending" });
    const errorLeads = await Lead.countDocuments({ status: "error" });

    res.status(200).json({
      summary: {
        totalLeads,
        scoredLeads,
        pendingLeads,
        errorLeads,
      },
      results: leads,
    });
  } catch (error: any) {
    console.error("Error fetching results:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const exportResults = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find({ status: "scored" })
      .select("name role company industry location intent score reasoning")
      .sort({ score: -1 });

    if (leads.length === 0) {
      return res.status(404).json({ message: "No scored leads to export." });
    }

    const headers = [
      "name",
      "role",
      "company",
      "industry",
      "location",
      "intent",
      "score",
      "reasoning",
    ];
    let csvContent = headers.join(",") + "\n";

    leads.forEach((lead) => {
      const row = [
        `"${lead.name}"`,
        `"${lead.role}"`,
        `"${lead.company}"`,
        `"${lead.industry}"`,
        `"${lead.location}"`,
        `"${lead.intent}"`,
        lead.score,
        `"${lead.reasoning.replace(/"/g, '""')}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=lead_scoring_results.csv"
    );
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error("Error exporting results:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

import { Request, Response } from "express";
import Lead, { ILead } from "../models/Lead";
import csv from "csv-parser";
import { Readable } from "stream";


export const uploadLeads = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const leads: ILead[] = [];

  const bufferStream = new Readable();
  bufferStream.push(req.file.buffer);
  bufferStream.push(null); 

  try {
  
    await Lead.deleteMany({});
    console.log("Cleared old leads from database.");

    bufferStream
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.trim().toLowerCase(),
        })
      )
      .on("data", (data) => {
     
        const leadData = {
          name: data.name || "",
          role: data.role || "",
          company: data.company || "",
          industry: data.industry || "",
          location: data.location || "",
          linkedin_bio: data.linkedin_bio || "",
          status: "pending", 
        } as ILead; 

        if (leadData.name && leadData.role && leadData.company) {
          leads.push(leadData);
        } else {
          console.warn("Skipping incomplete lead data:", data);
        }
      })
      .on("end", async () => {
        console.log(`Parsed ${leads.length} leads from CSV.`);

        if (leads.length === 0) {
          return res
            .status(400)
            .json({ message: "No valid leads found in CSV file" });
        }

        try {
          // Insert all parsed leads into the database in one go
          await Lead.insertMany(leads);
          res.status(201).json({
            message: `Successfully uploaded and saved ${leads.length} leads.`,
          });
        } catch (dbError: any) {
          console.error("Error saving leads to database:", dbError.message);
          res.status(500).json({ message: "Error saving leads to database" });
        }
      })
      .on("error", (err) => {
        console.error("Error parsing CSV stream:", err.message);
        res.status(500).json({ message: "Error parsing CSV file" });
      });
  } catch (error: any) {
    console.error("Error in uploadLeads setup:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

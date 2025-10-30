import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { ILead } from "../models/Lead";
import { IOffer } from "../models/Offer";
import dotenv from "dotenv";

dotenv.config();


const aiSchema = z.object({
  intent: z.enum(["High", "Medium", "Low"]),
  reasoning: z
    .string()
    .describe("Your 1-2 sentence explanation for the intent classification."),
});


export const getAIAssessment = async (
  lead: ILead,
  offer: IOffer
): Promise<{
  aiPoints: number;
  intent: "High" | "Medium" | "Low";
  reasoning: string;
}> => {
  console.log(`[AI] Starting assessment for lead: ${lead.name}`);

  const prompt = `You are an expert sales development representative. Your task is to score a lead's buying intent based on their profile and the product we are selling.

--- OFFER DETAILS (Our Product) ---
Product Name: ${offer.name}
Value Propositions: ${offer.value_props.join(", ")}
Ideal Use Cases (ICP): ${offer.ideal_use_cases.join(", ")}

--- LEAD DETAILS (The Prospect) ---
Name: ${lead.name}
Role: ${lead.role}
Company: ${lead.company}
Industry: ${lead.industry}
Location: ${lead.location}
LinkedIn Bio: ${lead.linkedin_bio || "Not provided"}

--- TASK ---
Analyze the LEAD DETAILS in the context of the OFFER DETAILS.
1. Classify the lead's buying intent as "High", "Medium", or "Low".
2. Provide a 1-2 sentence explanation for your classification.`;

  try {

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-lite"),
      schema: aiSchema,
      prompt: prompt,
    });

    const { intent, reasoning } = object;

    let aiPoints = 0;
    if (intent === "High") {
      aiPoints = 50;
    } else if (intent === "Medium") {
      aiPoints = 30;
    } else if (intent === "Low") {
      aiPoints = 10;
    }

    console.log(`[AI] Scored ${lead.name} as ${intent} (${aiPoints} pts)`);

    return { aiPoints, intent, reasoning };
  } catch (error: any) {
    console.error(`[AI] Error scoring lead ${lead.name}: ${error.message}`);
    console.error("Full error:", error);

    // Return a default "error" state if AI fails
    return {
      aiPoints: 0,
      intent: "Low",
      reasoning: "AI scoring failed or was unable to process this lead.",
    };
  }
};
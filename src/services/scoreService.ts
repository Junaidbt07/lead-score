import Lead, { ILead } from "../models/Lead";
import Offer, { IOffer } from "../models/Offer";
import { getAIAssessment } from "./aiService";


const DECISION_MAKER_KEYWORDS = [
  "head",
  "director",
  "vp",
  "c-level",
  "ceo",
  "cfo",
  "cto",
  "founder",
  "chief",
];
const INFLUENCER_KEYWORDS = ["manager", "senior", "lead", "principal"];


export const applyRuleLayer = (lead: ILead, offer: IOffer): number => {
  let ruleScore = 0;
  const roleLower = lead.role.toLowerCase();
  const industryLower = lead.industry.toLowerCase();

  if (DECISION_MAKER_KEYWORDS.some((keyword) => roleLower.includes(keyword))) {
    ruleScore += 20;
  } else if (INFLUENCER_KEYWORDS.some((keyword) => roleLower.includes(keyword))) {
    ruleScore += 10;
  }

  const icpIndustries = offer.ideal_use_cases.map((icp) => icp.toLowerCase());

  if (icpIndustries.some((icp) => icp.includes(industryLower))) {
    ruleScore += 20;
  }
  else if (
    icpIndustries.some((icp) => icp.includes("saas")) &&
    industryLower.includes("software")
  ) {
    ruleScore += 10;
  }

  if (
    lead.name &&
    lead.role &&
    lead.company &&
    lead.industry &&
    lead.location &&
    lead.linkedin_bio
  ) {
    ruleScore += 10;
  }

  console.log(`[Rules] Scored ${lead.name}: ${ruleScore} / 50`);
  return ruleScore;
};


const processSingleLead = async (lead: ILead, offer: IOffer): Promise<void> => {
  try {
    lead.status = "processing";
    await lead.save();

    const ruleScore = applyRuleLayer(lead, offer);

    const { aiPoints, intent, reasoning } = await getAIAssessment(lead, offer);

    lead.score = ruleScore + aiPoints;
    lead.intent = intent;
    lead.reasoning = reasoning;
    lead.status = "scored";

    await lead.save();
    console.log(`[Done] Successfully scored ${lead.name}: ${lead.score}`);
  } catch (error: any) {
    console.error(`[Error] Failed to process lead ${lead.name}: ${error.message}`);
    lead.status = "error";
    lead.reasoning = "Scoring pipeline failed.";
    await lead.save();
  }
};

export const runScoringPipeline = async (): Promise<void> => {
  console.log("[Pipeline] Starting scoring pipeline...");

  const offer = await Offer.findOne({});
  if (!offer) {
    console.error("[Pipeline] Aborting: No offer details found. Please POST /api/offer first.");
    return;
  }

  const leads = await Lead.find({ status: "pending" });
  if (leads.length === 0) {
    console.log("[Pipeline] No pending leads to score.");
    return;
  }

  console.log(`[Pipeline] Found ${leads.length} leads to score.`);

  for (const lead of leads) {
    await processSingleLead(lead, offer);
  }

  console.log("[Pipeline] Scoring pipeline complete.");
};

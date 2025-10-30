import { applyRuleLayer } from "../services/scoreService";
import { ILead } from "../models/Lead";
import { IOffer } from "../models/Offer";

const mockOffer = {
  name: "New Test Offer",
  value_props: [],
  ideal_use_cases: ["E-commerce", "Retail Logistics"],
} as unknown as IOffer;

describe("applyRuleLayer", () => {
  test("should score 50/50 for a perfect lead", () => {
    const lead = {
      name: "Marcus Cole",
      role: "Head of Logistics",
      company: "Shopify",
      industry: "E-commerce",
      location: "Ottawa",
      linkedin_bio: "Expert in e-commerce fulfillment and logistics.",
    } as unknown as ILead;

    const ruleScore = applyRuleLayer(lead, mockOffer);
    expect(ruleScore).toBe(50);
  });

  test("should score 40/50 for an influencer with an adjacent industry", () => {
    const lead = {
      name: "Sarah Jenkins",
      role: "Marketing Manager",
      company: "SupplyChain Inc.",
      industry: "Logistics",
      location: "Atlanta",
      linkedin_bio: "Marketing for supply chain and logistics solutions.",
    } as unknown as ILead;

    const ruleScore = applyRuleLayer(lead, mockOffer);
    expect(ruleScore).toBe(40);
  });

  test("should score 10/50 for an irrelevant lead", () => {
    const lead = {
      name: "Tom Allen",
      role: "Accountant",
      company: "HealthCorp",
      industry: "Healthcare",
      location: "Boston",
      linkedin_bio: "CPA with 10 years experience in healthcare finance.",
    } as unknown as ILead;

    const ruleScore = applyRuleLayer(lead, mockOffer);
    expect(ruleScore).toBe(10);
  });

  test("should score 40/50 for a lead with missing bio (fails completeness)", () => {
    const lead = {
      name: "Priya Singh",
      role: "Chief Operating Officer",
      company: "Global Retail",
      industry: "Retail",
      location: "Mumbai",
      linkedin_bio: "",
    } as unknown as ILead;

    const ruleScore = applyRuleLayer(lead, mockOffer);
    expect(ruleScore).toBe(40);
  });

  test("should score 20/50 for a completely empty lead object", () => {
    const lead = {
      name: "",
      role: "",
      company: "",
      industry: "",
      location: "",
      linkedin_bio: "",
    } as unknown as ILead;

    const ruleScore = applyRuleLayer(lead, mockOffer);
    expect(ruleScore).toBe(20);
  });
});
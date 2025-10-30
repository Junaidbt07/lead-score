import mongoose, { Document, Schema } from "mongoose";

type TStatus = "pending" | "processing" | "scored" | "error";
type TIntent = "High" | "Medium" | "Low" | null;

export interface ILead extends Document {
  name: string;
  role: string;
  company: string;
  industry: string;
  location: string;
  linkedin_bio: string;
  status: TStatus;
  score: number;
  intent: TIntent;
  reasoning: string;
}

const LeadSchema: Schema = new Schema(
  {
    name: { type: String },
    role: { type: String},
    company: { type: String, },
    industry: { type: String, },
    location: { type: String, },
    linkedin_bio: { type: String, },
    status: {
      type: String,
      enum: ["pending", "processing", "scored", "error"],
      default: "pending",
    },
    score: {
      type: Number,
      default: 0,
    },
    intent: {
      type: String,
      enum: ["High", "Medium", "Low", null],
      default: null,
    },
    reasoning: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILead>("Lead", LeadSchema);

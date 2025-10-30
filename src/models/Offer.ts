import mongoose, { Document, Schema } from "mongoose";

export interface IOffer extends Document {
  name: string;
  value_props: string[];
  ideal_use_cases: string[];
}

const OfferSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    value_props: {
      type: [String],
    },
    ideal_use_cases: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOffer>("Offer", OfferSchema);

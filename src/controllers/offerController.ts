
import { Request, Response } from "express";
import Offer, { IOffer } from "../models/Offer";


export const createOrUpdateOffer = async (req: Request, res: Response) => {
  const { name, value_props, ideal_use_cases } = req.body;


  if (!name || !value_props || !ideal_use_cases) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {

    const offer = await Offer.findOneAndUpdate(
      {}, 
      { name, value_props, ideal_use_cases },
      {
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json(offer);
  } catch (error: any) {
    console.error("Error updating offer:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

import mongoose from "mongoose";



export const payoutMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["bank", "easypaisa", "jazzcash", "paypal", "crypto"],
    required: true,
  },
  details: {
    type: Map, // flexible key-value storage for method-specific details
    of: String,
  },
  isPrimary: { type: Boolean, default: false },
}, { _id: false });



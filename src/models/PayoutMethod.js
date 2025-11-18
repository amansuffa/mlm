import mongoose from "mongoose";



export const payoutMethodSchema = new mongoose.Schema({
  methodName: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  isPrimary: { type: Boolean, default: false },
}, { _id: false });



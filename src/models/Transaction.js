import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["commission", "referral_bonus", "withdrawal"], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  description: String,
}, { timestamps: true });

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["admin", "membership"], required: true },
    amount: { type: Number, required: true },
    method: String,
    note: String,
    image: {type: String, required: true} ,
    name: String,
    email: String,
    username: String,
    transactionId: String,
    wiseAccountEmail: String,
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

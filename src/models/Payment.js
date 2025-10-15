import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true }, 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    name: { type: String },
    email: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" }, 
    pay_currency: { type: String }, 

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed", "expired"],
    },

    payment_id: { type: String },
    transaction_id: { type: String },
    ipn_data: Object,
    paid_at: Date,

  },
  { timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);


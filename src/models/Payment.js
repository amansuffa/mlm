const paymentSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  name: { type: String, required: false }, 
  email: { type: String, required: false },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  pay_currency: { type: String, required: true },
  status: { 
    type: String, 
    default: "pending",
    enum: ["pending", "paid", "failed", "expired"] 
  },
  payment_id: String, 
  transaction_id: String,
  ipn_data: Object,
  paid_at: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now } 
});
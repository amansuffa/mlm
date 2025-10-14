import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function updatePaymentStatus(order_id, newStatus) {
  await connectDB();

  const payment = await Payment.findOneAndUpdate(
    { order_id },
    { status: newStatus },
    { new: true }
  );

  console.log("Updated payment:", payment);
  return payment;
}

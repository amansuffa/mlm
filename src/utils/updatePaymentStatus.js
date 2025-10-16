import { connectDB } from "@/lib/mongodb";
import {Payment} from "@/models/Payment";
import { User } from "@/models/User";

export async function updatePaymentStatus(order_id, newStatus) {
  await connectDB();
const payment = await Payment.findOne({ order_id });
if (!payment) return;

const userId = payment.user_id.toString();

 await Payment.findOneAndUpdate(
    { order_id },
    { status: newStatus },
    { new: true }
  );

if (newStatus === "paid" || newStatus === "completed") {
    await User.findByIdAndUpdate(
      userId, 
      { 
        status: "admin_fee_paid", 
        adminFeePaid: true 
      }
    );
  }

  console.log("Updated payment:", payment);
  return payment;
}

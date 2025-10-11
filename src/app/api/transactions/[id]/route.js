import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { auth } from "@/auth";

export async function PATCH(req, { params }) {
  await connectDB();
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const { action } = await req.json(); // "approve" or "reject"
  const newStatus = action === "approve" ? "completed" : "rejected";

  // Update transaction status
  const tx = await Transaction.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  );

  if (!tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  // Get the user who made the payment
  const user = await User.findById(tx.fromUser);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Update user payment flags
  if (tx.type === "admin") {
    user.adminFeePaid = action === "approve";
  } else if (tx.type === "membership") {
    user.membershipFeePaid = action === "approve";
  }

  // Update user status based on both payments
  if (user.adminFeePaid && user.membershipFeePaid) {
    user.status = "fully_active";
  } else if (user.adminFeePaid) {
    user.status = "admin_fee_paid";
  } else if (user.membershipFeePaid) {
    user.status = "membership_paid";
  } else {
    user.status = "free";
  }

  await user.save();

  return NextResponse.json({ success: true, data: tx });
}

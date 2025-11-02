import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {Transaction} from "@/models/Transaction";
import {User} from "@/models/User";
import { distributeMembershipFee } from "@/utils/feeDistribution";

export async function GET(request,context) {
  try {
    await connectDB();
        const { id } = await context.params;

    const transaction = await Transaction.findById(id)
      .populate('fromUser', 'username')
      .populate('toUser', 'username');
    
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  try {
    await connectDB();
        const { id } = await context.params;
    const { action } = await req.json();
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

  // Update user payment flags only if approved
  if (action === "approve") {
    if (tx.type === "admin") {
      user.adminFeePaid = true;
    } else if (tx.type === "membership") {
      user.membershipFeePaid = true;
      
      // ✅ Fee Distribution Logic - Membership Payment Approved
      // Carefully wrapped in try-catch so existing flow doesn't break
      try {
        const distributionResult = await distributeMembershipFee(user, tx.amount || 500);
        
        if (distributionResult.success) {
          console.log(`✅ Fee distributed: $${distributionResult.amount} to ${distributionResult.recipient.username} (${distributionResult.distributionType})`);
          console.log(`📊 Referrer ${distributionResult.referrer.username} invite count: ${distributionResult.inviteNumber}`);
        } else {
          console.warn(`⚠️ Fee distribution skipped: ${distributionResult.message}`);
        }
      } catch (feeError) {
        // Log error but don't break the transaction approval
        console.error("Error in fee distribution (non-blocking):", feeError);
      }
    }
  } else {
    // If rejected, set payment flag to false
    if (tx.type === "admin") {
      user.adminFeePaid = false;
    } else if (tx.type === "membership") {
      user.membershipFeePaid = false;
    }
  }

  // Update user status based on current payment status
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

  // Update tx status for return
  tx.status = newStatus;

  return NextResponse.json({ success: true, data: tx });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

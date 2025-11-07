import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { distributeMembershipFee } from "@/utils/feeDistribution";
import { EmailTemplate } from "@/models/EmailTemplate";
import { sendEmail } from "@/lib/sendEmail";
import { parseTemplate } from "@/lib/parseTemplate";

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const transaction = await Transaction.findById(id)
      .populate("fromUser", "username")
      .populate("toUser", "username");

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
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

    if (!tx)
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );

    // Get the user who made the payment
    const user = await User.findById(tx.fromUser);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const sponsor = await User.findOne({ username: user.referredBy });

    // Update user payment flags only if approved
    if (action === "approve") {
      if (tx.type === "admin") {
        user.adminFeePaid = true;
        const template = await EmailTemplate.findOne({
          type: "user_admin_fee_paid",
        });
        if (!template) {
          return NextResponse.json(
            { error: "Template not found" },
            { status: 404 }
          );
        }

        const html = parseTemplate(template.body, {
          FirstName: user.name,
          LoginLink: `${process.env.NEXTAUTH_URL}/login`,
          SponsorPaymentLink: `${process.env.NEXTAUTH_URL}/user/pay-to-sponser`,
        });

        await sendEmail(user.email, template.subject, html);
      } else if (tx.type === "membership") {
        user.membershipFeePaid = true;

        // ✅ Fee Distribution Logic - Membership Payment Approved
        // This must run BEFORE updating sponsor status
        let distributionResult = null;
        try {
          distributionResult = await distributeMembershipFee(
            user,
            tx.amount || 500
          );

          if (distributionResult.success) {
            console.log(
              `✅ Fee distributed: $${distributionResult.amount} to ${distributionResult.recipient.username} (${distributionResult.distributionType})`
            );
            console.log(
              `📊 Referrer ${distributionResult.referrer.username} invite count: ${distributionResult.inviteNumber}`
            );

            // ✅ PART 5: Add to passupReferrals only if distributionType is "pass_up"
            if (distributionResult.distributionType === "pass_up") {
              const recipient = distributionResult.recipient;
              if (recipient && recipient._id) {
                if (!recipient.passupReferrals) {
                  recipient.passupReferrals = [];
                }
                // Check if user._id already exists to avoid duplicates
                if (
                  !recipient.passupReferrals.some(
                    (id) => id.toString() === user._id.toString()
                  )
                ) {
                  recipient.passupReferrals.push(user._id);
                  await recipient.save();
                  console.log(
                    `✅ Added user ${user.username} to ${recipient.username}'s passupReferrals`
                  );
                }
              }
            }
            // If distributionType is "direct", do NOT push to passupReferrals
          } else {
            console.warn(
              `⚠️ Fee distribution skipped: ${distributionResult.message}`
            );
          }
        } catch (feeError) {
          // Log error but don't break the transaction approval
          console.error("Error in fee distribution (non-blocking):", feeError);
        }

        // Update sponsor's first sale status
        if (sponsor) {
          // If this was sponsor's first sale (pass-up), mark it as complete
          if (
            distributionResult &&
            distributionResult.success &&
            distributionResult.distributionType === "pass_up"
          ) {
            sponsor.hasFirstSale = true;
          }
          // Unlock sponsor's first sale (if it was locked)
          if (sponsor.firstSaleLocked) {
            sponsor.firstSaleLocked = false;
            sponsor.firstSaleLockedBy = null;
            sponsor.firstSaleLockedAt = null;
          }
          await sponsor.save();
        }

        const template = await EmailTemplate.findOne({
          type: "user_membership_activated",
        });
        if (!template) {
          return NextResponse.json(
            { error: "Template not found" },
            { status: 404 }
          );
        }

        const html = parseTemplate(template.body, {
          FirstName: user.name,
          LoginLink: `${process.env.NEXTAUTH_URL}/login`,
        });

        await sendEmail(user.email, template.subject, html);
      }
    } else {
      // If rejected, set payment flag to false
      if (tx.type === "admin") {
        user.adminFeePaid = false;
      } else if (tx.type === "membership") {
        user.membershipFeePaid = false;
        if (sponsor && (!sponsor.hasFirstSale || sponsor.firstSaleLocked)) {
          sponsor.firstSaleLocked = false;
          sponsor.firstSaleLockedBy = null;
          await sponsor.save();
        }
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
    console.error("Transaction approval error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

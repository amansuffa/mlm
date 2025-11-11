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

    const sponsorUpline = sponsor
      ? await User.findOne({ username: sponsor.referredBy })
      : null;

          const admin = await User.findOne({ role: "admin" });
      

    // Update user payment flags only if approved
    if (action === "approve") {
      if (tx.type === "admin") {
        user.adminFeePaid = true;

        const userTemplate = await EmailTemplate.findOne({
          type: "user_admin_fee_paid",
        });
        const sponsorTemplate = await EmailTemplate.findOne({
          type: "sponsor_referral_admin_fee_paid",
        });

        const templateData = {
          MemberFirstName: user.firstName || user.name,
          MemberName: user.name,
          MemberEmail: user.email,
          MemberUsername: user.username,
          SponsorName: sponsor?.name || "N/A",
          SponsorFirstName: sponsor?.firstName || "N/A",
          SponsorEmail: sponsor?.email || "N/A",
          LoginLink: `${process.env.NEXTAUTH_URL}/login`,
          SponsorPaymentLink: `${process.env.NEXTAUTH_URL}/user/pay-to-sponser`,
        };

        // Send email to user
        if (userTemplate) {
          const userHtml = parseTemplate(userTemplate.body, templateData);
          await sendEmail(user.email, userTemplate.subject, userHtml);
        }

        // Send email to sponsor
        if (sponsorTemplate && sponsor) {
          const sponsorHtml = parseTemplate(sponsorTemplate.body, templateData);
          await sendEmail(sponsor.email, sponsorTemplate.subject, sponsorHtml);
        }
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

            // ✅ PART 5: Add to passupSales only if distributionType is "pass_up"
            if (distributionResult.distributionType === "pass_up") {
              const recipient = distributionResult.recipient;
              if (recipient && recipient._id) {
                if (!recipient.passupSales) {
                  recipient.passupSales = [];
                }
                // Check if user._id already exists to avoid duplicates
                if (
                  !recipient.passupSales.some(
                    (id) => id.toString() === user._id.toString()
                  )
                ) {
                  recipient.passupSales.push(user._id);
                  await recipient.save();
                  console.log(
                    `✅ Added user ${user.username} to ${recipient.username}'s passupSales`
                  );
                }
              }
            } else if (distributionResult.distributionType === "direct") {
              const recipient = distributionResult.recipient;
              if (!recipient.directSales) {
                recipient.directSales = [];
              }
              recipient.directSales.push(user._id);
              await recipient.save();

              console.log(
                `✅ Added user ${user.username} to ${recipient.username}'s directSales`
              );
            }
            // If distributionType is "direct", do NOT push to passupSales
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
            // sponsor.firstSaleLockedBy = null;
            sponsor.firstSaleLockedAt = null;
          }
          await sponsor.save();
        }

        // Refetch user data to get updated directSales and other fields after fee distribution
        const updatedUser = await User.findById(tx.fromUser);
        const updatedSponsor = await User.findOne({ username: updatedUser.referredBy });
        const updatedSponsorUpline = updatedSponsor
          ? await User.findOne({ username: updatedSponsor.referredBy })
          : null;

    const userTemplate = await EmailTemplate.findOne({
      type: "user_membership_activated",
    });
    const userPassupTemplate = await EmailTemplate.findOne({
      type: "user_first_sale_passed_up",
    });
    const userSecondSaleTemplate = await EmailTemplate.findOne({
      type: "user_new_sale_earned",
    });
    const sponsorTemplate = await EmailTemplate.findOne({
      type: "sponsor_activated_downline",
    });
    const adminTemplate = await EmailTemplate.findOne({
      type: "admin_member_activated",
    });
    const sponsorUplineTemplate = await EmailTemplate.findOne({
      type: "sponsor_of_sponsor_member_activated",
    });
   
    const paidTo = distributionResult?.recipient;
    const activatedBy = distributionResult?.distributionType === "direct" ? sponsor?.username : sponsorUpline?.username || "N/A";
    console.log("Paid To:", paidTo);
    const templateData = {
      MemberFirstName: updatedUser.firstName || updatedUser.name,
      MemberName: updatedUser.name,
      MemberEmail: updatedUser.email,
      MemberUsername: updatedUser.username,
      SponsorName: updatedSponsor?.name || "N/A",
      SponsorFirstName: updatedSponsor?.firstName || "N/A",
      SponsorEmail: updatedSponsor?.email || "N/A",
      SponsorUplineFirstName:
        updatedSponsorUpline?.firstName || updatedSponsorUpline?.name || "N/A",
      LoginLink: `${process.env.NEXTAUTH_URL}/login`,
      PaymentDate: new Date().toLocaleDateString(),
      PaidTo: paidTo?.name || paidTo?.firstName || "N/A",
      ActivatedBy : activatedBy,
      ActivationDate : new Date().toLocaleDateString(),
    };

    // Send email to user
    if (userTemplate) {
      const userHtml = parseTemplate(userTemplate.body, templateData);
      await sendEmail(updatedUser.email, userTemplate.subject, userHtml);
    }
    if (userSecondSaleTemplate && updatedUser.hasFirstSale && updatedUser.directSales && updatedUser.directSales.length === 1) {
      const userHtml = parseTemplate(userSecondSaleTemplate.body, templateData);
      await sendEmail(updatedUser.email, userSecondSaleTemplate.subject, userHtml);
    }

    // Send email to sponsor
    if (distributionResult?.distributionType === "direct") {
      if (sponsorTemplate && updatedSponsor) {
        const sponsorHtml = parseTemplate(sponsorTemplate.body, templateData);
        await sendEmail(updatedSponsor.email, sponsorTemplate.subject, sponsorHtml);
      }
    }
    // Send email to admin
    if (adminTemplate && admin) {
      const adminHtml = parseTemplate(adminTemplate.body, templateData);
      await sendEmail(admin.email, adminTemplate.subject, adminHtml);
    }

    // Send email to sponsor's sponsor if applicable
    if (distributionResult?.distributionType === "pass_up") {
      if (sponsorUplineTemplate && updatedSponsorUpline) {
        const sponsorUplineHtml = parseTemplate(
          sponsorUplineTemplate.body,
          templateData
        );
        await sendEmail(
          updatedSponsorUpline.email,
          sponsorUplineTemplate.subject,
          sponsorUplineHtml
        );
      }
       if (userPassupTemplate) {
      const userHtml = parseTemplate(userPassupTemplate.body, templateData);
      await sendEmail(updatedUser.email, userPassupTemplate.subject, userHtml);
    }
    }

    // Schedule delayed email for action plan (5 hours after activation)
    setTimeout(async () => {
      try {
        const actionPlanTemplate = await EmailTemplate.findOne({
          type: "user_action_plan",
        });
        
        if (actionPlanTemplate) {
          const actionPlanHtml = parseTemplate(actionPlanTemplate.body, templateData);
          await sendEmail(updatedUser.email, actionPlanTemplate.subject, actionPlanHtml);
          console.log(`✅ Action plan email sent to ${updatedUser.username} after 5 hours`);
        }
      } catch (error) {
        console.error("Error sending delayed action plan email:", error);
      }
    }, 5 * 60 * 60 * 1000); // 5 hours in milliseconds

        
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
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

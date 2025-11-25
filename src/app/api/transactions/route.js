import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { EmailTemplate } from "@/models/EmailTemplate";
import { sendEmail } from "@/lib/sendEmail";
import { parseTemplate } from "@/lib/parseTemplate";

// ✅ Get All Transactions
export async function GET(req) {
  await connectDB();
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const queryUserId = searchParams.get("userId");
  const queryType = searchParams.get("type");

  const userId = session.user.id;
  const role = session.user.role;

  let transactions;

  // Handle specific queries for admin fee status check
  if (queryUserId && queryType) {
    // Allow checking admin fee status for specific user
    transactions = await Transaction.find({
      fromUser: queryUserId,
      type: queryType,
    })
      .populate("fromUser", "name username email")
      .populate("toUser", "name username email")
      .sort({ createdAt: -1 });
  } else if (role === "admin") {
    transactions = await Transaction.find({})
      .populate("fromUser", "name username email")
      .populate("toUser", "name username email")
      .sort({ createdAt: -1 });
  } else {
    transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate("fromUser", "name username email")
      .populate("toUser", "name username email")
      .sort({ createdAt: -1 });
  }

  return NextResponse.json(transactions);
}

// ✅ Create new transaction (from PayToSponsorPage)
export async function POST(req) {
  await connectDB();
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { sender, receiver, amount, type, method, note, image } = body;

    if (!sender || !receiver || !amount || !type)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // For membership transactions, verify recipient is correct based on lock status
    let finalReceiver = receiver;
    if (type === "membership") {
      const user = await User.findById(sender);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const sponsor = await User.findOne({ username: user.referredBy });
      if (!sponsor) {
        return NextResponse.json(
          { error: "Sponsor not found" },
          { status: 404 }
        );
      }

      // Admin users don't have first sale qualification - all payments go directly to them
      if (sponsor.role === "admin") {
        finalReceiver = sponsor._id;
      }
      // Check if sponsor's first sale is locked
      else if (sponsor.firstSaleLocked) {
        // Check if locked by current user
        if (
          sponsor.firstSaleLockedBy &&
          sponsor.firstSaleLockedBy.toString() === sender
        ) {
          // Locked by current user → pay to sponsor's sponsor (1-up pass-up)
          let sponsorUpline = null;
          if (sponsor.isPassup) {
            sponsorUpline = await User.findById(sponsor.passupSponsor);
            
          } else {
            sponsorUpline = await User.findOne({
              username: sponsor.referredBy,
            });
          }
          if (sponsorUpline) {
            finalReceiver = sponsorUpline._id;
          } else {
            // No sponsor upline → fallback to sponsor
            finalReceiver = sponsor._id;
          }
        } else {
          // Locked by someone else → pay to sponsor
          finalReceiver = sponsor._id;
        }
      } else if (sponsor.hasFirstSale) {
        // Sponsor already has first sale → pay to sponsor
        finalReceiver = sponsor._id;
      } else {
        // No first sale → pay to sponsor's sponsor (1-up pass-up) and set lock
        let sponsorUpline = null;
        if (sponsor.isPassup) {
          sponsorUpline = await User.findById(sponsor.passupSponsor);
        } else {
          sponsorUpline = await User.findOne({
            username: sponsor.referredBy,
          });
        }
        if (sponsorUpline) {
          finalReceiver = sponsorUpline._id;
          // Set lock for sponsor's first sale
          sponsor.firstSaleLocked = true;
          sponsor.firstSaleLockedBy = user._id;
          sponsor.firstSaleLockedAt = new Date();
          await sponsor.save();
        } else {
          // No sponsor upline → fallback to sponsor
          finalReceiver = sponsor._id;
        }
      }
    }

    const newTx = await Transaction.create({
      fromUser: sender,
      toUser: finalReceiver,
      amount,
      type,
      method,
      note,
      image,
      status: "pending",
    });

    const user = await User.findById(sender);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find email receiver
    const sponsor = await User.findOne({ username: user.referredBy });
    let sponsorUpline = null;
    if (sponsor.isPassup) {
      sponsorUpline = await User.findById(sponsor.passupSponsor);
    } else {
      sponsorUpline = await User.findOne({
        username: sponsor.referredBy,
      });
    }
    const admin = await User.findOne({ role: "admin" });
    // Find email templates
    const userTemplate = await EmailTemplate.findOne({
      type: "user_membership_fee_paid",
    });
    const sponsorTemplate = await EmailTemplate.findOne({
      type: "sponsor_confirm_payment",
    });
    const adminTemplate = await EmailTemplate.findOne({
      type: "admin_membership_payment_sent",
    });
    const sponsorUplineTemplate = await EmailTemplate.findOne({
      type: "sponsor_of_sponsor_confirm_payment",
    });
    const sponsorUplinePassupTemplate = await EmailTemplate.findOne({
      type: "sponsor_of_sponsor_passed_up_sale",
    });
    const paidTo = await User.findById(finalReceiver);
    const templateData = {
      MemberFirstName: user.firstName || user.name?.split(" ")[0] || "Member",
      MemberName:
        user.name ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username,
      MemberEmail: user.email,
      MemberUsername: user.username,
      SponsorName:
        sponsor?.name ||
        `${sponsor?.firstName || ""} ${sponsor?.lastName || ""}`.trim() ||
        "N/A",
      SponsorFirstName:
        sponsor?.firstName || sponsor?.name?.split(" ")[0] || "N/A",
      SponsorEmail: sponsor?.email || "N/A",
      SponsorUplineFirstName:
        sponsorUpline?.firstName || sponsorUpline?.name?.split(" ")[0] || "N/A",
      LoginLink: `${process.env.NEXTAUTH_URL}/login`,
      PaymentDate: new Date().toLocaleDateString(),
      PaidTo: paidTo?.name || paidTo?.firstName || "N/A",
    };

    // Send email to user
    if (userTemplate) {
      try {
        const userHtml = parseTemplate(userTemplate.body, templateData);
        await sendEmail(user.email, userTemplate.subject, userHtml);
        console.log(`✅ User email sent to ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to send user email to ${user.email}:`, error);
      }
    }

    // Send email to sponsor
    if (sponsor && (sponsor.hasFirstSale || sponsor.role === "admin")) {
      if (sponsorTemplate) {
        try {
          const sponsorHtml = parseTemplate(sponsorTemplate.body, templateData);
          await sendEmail(sponsor.email, sponsorTemplate.subject, sponsorHtml);
          console.log(`✅ Sponsor email sent to ${sponsor.email}`);
        } catch (error) {
          console.error(
            `❌ Failed to send sponsor email to ${sponsor.email}:`,
            error
          );
        }
      }
    }

    // Send email to admin
    if (adminTemplate && admin) {
      try {
        const adminHtml = parseTemplate(adminTemplate.body, templateData);
        await sendEmail(admin.email, adminTemplate.subject, adminHtml);
        console.log(`✅ Admin email sent to ${admin.email}`);
      } catch (error) {
        console.error(
          `❌ Failed to send admin email to ${admin.email}:`,
          error
        );
      }
    }

    // Send email to sponsor's sponsor if applicable (not for admin sponsors)
    if (sponsor && !sponsor.hasFirstSale && sponsor.role !== "admin") {
      if (sponsorUplineTemplate && sponsorUpline) {
        try {
          const sponsorUplineHtml = parseTemplate(
            sponsorUplineTemplate.body,
            templateData
          );
          await sendEmail(
            sponsorUpline.email,
            sponsorUplineTemplate.subject,
            sponsorUplineHtml
          );
          console.log(`✅ Sponsor upline email sent to ${sponsorUpline.email}`);
        } catch (error) {
          console.error(
            `❌ Failed to send sponsor upline email to ${sponsorUpline.email}:`,
            error
          );
        }
      }
      if (sponsorUplinePassupTemplate && sponsorUpline) {
        try {
          const sponsorUplineHtml = parseTemplate(
            sponsorUplinePassupTemplate.body,
            templateData
          );
          await sendEmail(
            sponsorUpline.email,
            sponsorUplinePassupTemplate.subject,
            sponsorUplineHtml
          );
          console.log(
            `✅ Sponsor upline passup email sent to ${sponsorUpline.email}`
          );
        } catch (error) {
          console.error(
            `❌ Failed to send sponsor upline passup email to ${sponsorUpline.email}:`,
            error
          );
        }
      }
    }
    return NextResponse.json({ success: true, data: newTx });
  } catch (err) {
    console.error("Error creating transaction:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

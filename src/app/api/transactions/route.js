// import { NextResponse } from "next/server";
// import { Transaction } from "@/models/Transaction";
// import { User } from "@/models/User";
// import { auth } from "@/auth";
// import { connectDB } from "@/lib/mongodb";

// export async function GET() {
//   await connectDB();
//   const session = await auth();

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const userId = session.user.id;
//   const role = session.user.role;

//   let transactions;

//   if (role === "admin") {
//     transactions = await Transaction.find({})
//       .populate("fromUser", "name email username")
//       .populate("toUser", "name email username")
//       .sort({ createdAt: -1 });
//   } else {
//     const downlineUsers = await User.find({ referredBy: userId }).select("_id");
//     const downlineIds = downlineUsers.map(u => u._id);

//     transactions = await Transaction.find({
//       $or: [
//         { fromUser: userId },
//         { toUser: userId },
//         { fromUser: { $in: downlineIds } },
//         { toUser: { $in: downlineIds } }
//       ]
//     })
//     .populate("fromUser", "name email username")
//     .populate("toUser", "name email username")
//     .sort({ createdAt: -1 });
//   }

//   return NextResponse.json(transactions);
// }



import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { EmailTemplate } from "@/models/EmailTemplate";
import { sendEmail } from "@/lib/sendEmail";
import { parseTemplate } from "@/lib/parseTemplate";

// ✅ Get All Transactions
export async function GET() {
  await connectDB();
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const role = session.user.role;

  let transactions;

  if (role === "admin") {
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
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
        return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
      }

      // Check if sponsor's first sale is locked
      if (sponsor.firstSaleLocked) {
        // Check if locked by current user
        if (
          sponsor.firstSaleLockedBy &&
          sponsor.firstSaleLockedBy.toString() === sender
        ) {
          // Locked by current user → pay to sponsor's sponsor (1-up pass-up)
          const sponsorUpline = await User.findOne({
            username: sponsor.referredBy,
          });
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
        const sponsorUpline = await User.findOne({
          username: sponsor.referredBy,
        });
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

    const template = await EmailTemplate.findOne({
      type: "user_membership_fee_paid",
    });
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const html = parseTemplate(template.body, {
      FirstName: user.name,
    });

    await sendEmail(user.email, template.subject, html);

    return NextResponse.json({ success: true, data: newTx });
  } catch (err) {
    console.error("Error creating transaction:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}


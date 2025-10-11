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

    const newTx = await Transaction.create({
      fromUser: sender,
      toUser: receiver,
      amount,
      type,
      method,
      note,
      image,
      status: "pending",
    });

    // (Optional) Notification can be created here later
    // await Notification.create({
    //   user: receiver,
    //   message: `New payment of $${amount} received from ${session.user.name}`,
    //   link: `/transactions`,
    // });

    return NextResponse.json({ success: true, data: newTx });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


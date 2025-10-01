import { NextResponse } from "next/server";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const role = session.user.role;

  let transactions;

  if (role === "admin") {
    transactions = await Transaction.find({})
      .populate("fromUser", "name email username")
      .populate("toUser", "name email username")
      .sort({ createdAt: -1 });
  } else {
    const downlineUsers = await User.find({ referredBy: userId }).select("_id");
    const downlineIds = downlineUsers.map(u => u._id);

    transactions = await Transaction.find({
      $or: [
        { fromUser: userId },
        { toUser: userId },
        { fromUser: { $in: downlineIds } },
        { toUser: { $in: downlineIds } }
      ]
    })
    .populate("fromUser", "name email username")
    .populate("toUser", "name email username")
    .sort({ createdAt: -1 });
  }

  return NextResponse.json(transactions);
}

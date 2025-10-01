import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";

export async function GET() {
  await connectDB();
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id; // ObjectId of current user
  const role = session.user.role;

  let kpis = {
    directReferrals: 0,
    indirectReferrals: 0,
    totalDownline: 0,
    totalEarnings: 0,
    currentRank: session.user.rank || "Bronze",
  };

  if (role === "admin") {
    // Admin sees all totals except self
    const allUsers = await User.find({ _id: { $ne: userId } }).select("_id referredBy");
    kpis.totalDownline = allUsers.length;

    kpis.directReferrals = allUsers.filter(u => u.referredBy?.toString() === userId).length;
    kpis.indirectReferrals = kpis.totalDownline - kpis.directReferrals;

    const earningsAgg = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    kpis.totalEarnings = `$${earningsAgg[0]?.total || 0}`;
  } else {
    // Regular user sees only their own
    const directUsers = await User.find({ referredBy: userId }).select("_id");
    kpis.directReferrals = directUsers.length;

    const directIds = directUsers.map(u => u._id);
    kpis.indirectReferrals = await User.countDocuments({ referredBy: { $in: directIds } });

    kpis.totalDownline = kpis.directReferrals + kpis.indirectReferrals;

    const earningsAgg = await Transaction.aggregate([
      { $match: { toUser: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    kpis.totalEarnings = `$${earningsAgg[0]?.total || 0}`;
  }

  return NextResponse.json(kpis);
}

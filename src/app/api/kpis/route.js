import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";

export async function GET() {
  await connectDB();
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = session.user.username; // use username for referral comparison
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
    const allUsers = await User.find({ username: { $ne: username } }).select("username referredBy");
    kpis.totalDownline = allUsers.length;

    kpis.directReferrals = allUsers.filter(u => u.referredBy === username).length;
    kpis.indirectReferrals = kpis.totalDownline - kpis.directReferrals;

    const earningsAgg = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    kpis.totalEarnings = `$${earningsAgg[0]?.total || 0}`;
  } else {
    // Regular user sees only their own
    const directUsers = await User.find({ referredBy: username }).select("username");
    kpis.directReferrals = directUsers.length;

    const directUsernames = directUsers.map(u => u.username);
    kpis.indirectReferrals = await User.countDocuments({ referredBy: { $in: directUsernames } });

    kpis.totalDownline = kpis.directReferrals + kpis.indirectReferrals;

    // Updated: User.earnings field se earnings fetch karo
    const currentUser = await User.findOne({ username }).select("earnings");
    const totalEarnings = currentUser?.earnings?.total || 0;
    kpis.totalEarnings = `$${totalEarnings}`;
  }

  return NextResponse.json(kpis);
}

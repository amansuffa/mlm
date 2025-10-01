import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";

export async function GET() {
  await connectDB();
  
  const totalUsers = await User.countDocuments();
  const directReferrals = await User.countDocuments({ referredBy: { $ne: null } });
  const totalEarnings = await Transaction.aggregate([
    { $match: { type: "commission", status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  
  return Response.json({
    directReferrals,
    indirectReferrals: Math.floor(directReferrals * 1.5),
    totalDownline: totalUsers,
    totalEarnings: totalEarnings[0]?.total || 0,
    currentRank: "Silver"
  });
}
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  await connectDB();
  
  const topReferrers = await User.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "username",
        foreignField: "referredBy",
        as: "referrals"
      }
    },
    {
      $project: {
        name: 1,
        referrals: { $size: "$referrals" }
      }
    },
    { $match: { referrals: { $gt: 0 } } },
    { $sort: { referrals: -1 } },
    { $limit: 3 }
  ]);
  
  return Response.json(topReferrers);
}
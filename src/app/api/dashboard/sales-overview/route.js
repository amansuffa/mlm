import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  await connectDB();
  
  const usersByCountry = await User.aggregate([
    { $group: { _id: "$country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  const mapData = [
    { country: "us", value: 100000 },
    { country: "in", value: 80000 },
    { country: "br", value: 50000 },
    { country: "cn", value: 120000 },
    { country: "ca", value: 40000 }
  ];
  
  const topMarkets = [
    { name: "China", value: "120k", color: "bg-red-500" },
    { name: "USA", value: "100k", color: "bg-blue-500" },
    { name: "India", value: "80k", color: "bg-green-500" }
  ];
  
  return Response.json({ mapData, topMarkets });
}
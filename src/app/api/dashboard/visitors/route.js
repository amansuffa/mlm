import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";

export async function GET() {
  await connectDB();
  
  const weeklyCommissions = await Transaction.aggregate([
    {
      $match: {
        type: "commission",
        status: "completed",
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        commission: { $sum: "$amount" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);
  
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = days.map((day, index) => {
    const data = weeklyCommissions.find(d => d._id === index + 1);
    return { period: day, commission: data?.commission || 0 };
  });
  
  return Response.json(result);
}
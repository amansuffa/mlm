import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get users with earnings and calculate total sales (exclude admin)
    const users = await User.find({
      "earnings.history": { $exists: true, $ne: [] },
      role: { $ne: "admin" }
    }).select("name username earnings");

    // Calculate total sales for each user and sort
    const topReferrers = users
      .map(user => ({
        name: user.name || user.username,
        username: user.username,
        totalSales: user.earnings?.history?.length || 0,
        totalEarnings: user.earnings?.total || 0
      }))
      .filter(user => user.totalSales > 0)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 3);

    return NextResponse.json(topReferrers);

  } catch (error) {
    console.error("Top referrers error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
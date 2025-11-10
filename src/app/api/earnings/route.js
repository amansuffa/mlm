import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const period = searchParams.get("period"); // weekly, monthly, yearly, all-time

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    // user find
    const user = await User.findById(userId).select("earnings.history");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    let history = user.earnings.history;

    // Filter by period or custom date range
    let fromDate, toDate;
    
    if (from && to) {
      fromDate = new Date(from);
      toDate = new Date(to);
    } else if (period) {
      toDate = new Date();
      switch (period) {
        case 'weekly':
          fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'yearly':
          fromDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'all-time':
          fromDate = null;
          break;
        default:
          fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }
    } else {
      toDate = new Date();
      fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    
    if (fromDate) {
      history = history.filter(
        (item) =>
          new Date(item.date) >= fromDate && new Date(item.date) <= toDate
      );
    }

    // sort date-wise ascending
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

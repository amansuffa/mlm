import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "weekly";
    const isAdmin = searchParams.get("isAdmin") === "true";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!userId || !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all users' earnings for admin
    const users = await User.find({}).select("earnings.history");
    const history = users.flatMap(user => user.earnings.history || []);

    // Filter by custom date range or period
    let fromDate, toDate;
    
    if (from && to) {
      fromDate = new Date(from);
      toDate = new Date(to);
    } else {
      const now = new Date();
      toDate = now;
      
      switch (period) {
        case 'weekly':
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'yearly':
          fromDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'all-time':
          fromDate = null;
          break;
        default:
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
    }

    const filteredHistory = fromDate ? 
      history.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= fromDate && itemDate <= toDate;
      }) : history;

    // Group data by period or date-wise for custom filtering
    const groupedData = {};
    filteredHistory.forEach(item => {
      const date = new Date(item.date);
      let key;
      
      // If custom date range is used, show date-wise
      if (from && to) {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (period === 'weekly') {
        key = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (period === 'monthly') {
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else {
        key = date.getFullYear().toString();
      }
      
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += item.amount || 0;
    });

    const data = Object.entries(groupedData).map(([label, revenue]) => ({
      label,
      revenue
    }));

    const total = filteredHistory.reduce((sum, item) => sum + (item.amount || 0), 0);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error("Error fetching earnings summary:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
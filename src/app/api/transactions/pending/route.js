import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();
    
    // Get user from session/auth - you might need to implement auth check here
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let query;

    // If admin, show both admin fee transactions AND membership transactions where admin is receiver
    // If regular user, show membership transactions where they are the receiver (sponsor)
    if (user.role === "admin") {
      query = {
        status: "pending",
        $or: [
          { type: "admin" },
          { type: "membership", toUser: userId }
        ]
      };
    } else {
      query = {
        status: "pending",
        type: "membership",
        toUser: userId
      };
    }

    const transactions = await Transaction.find(query)
      .populate('fromUser', 'username')
      .populate('toUser', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      transactions, 
      count: transactions.length 
    });
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
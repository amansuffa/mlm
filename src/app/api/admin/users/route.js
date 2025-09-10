// src/app/api/users/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/auth"; // adjust path to your authOptions

export async function GET(req) {
  try {
    await connectDB();

    // Get logged-in user session
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find logged-in user
    const currentUser = await User.findOne({ email: session.user.email });

    // Fetch all users except current user
    const users = await User.find(
      { _id: { $ne: currentUser._id } },
      { password: 0 } // hide password
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

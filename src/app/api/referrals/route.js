
import { getServerSession } from "next-auth";
import { auth } from "@/auth"; 
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const referrals = await User.find({ referredBy: currentUser.referralId })
      .select("name email referralId");

    return NextResponse.json({
      referralId: currentUser.referralId,
      referrals,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

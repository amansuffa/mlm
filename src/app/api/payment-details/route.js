import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get admin with payout methods
    const admin = await User.findOne({ role: "admin" }).select('username payoutMethods');
    
    // Get admin's primary payout method
    const adminPayout = admin?.payoutMethods?.find(method => method.isPrimary) || admin?.payoutMethods?.[0];
    
    // Get sponsor by username
    const sponsor = user.referredBy ? await User.findOne({ username: user.referredBy }).select('username payoutMethods') : null;
    
    // Get sponsor's primary payout method
    const sponsorPayout = sponsor?.payoutMethods?.find(method => method.isPrimary) || sponsor?.payoutMethods?.[0];

    const paymentDetails = {
      admin: {
        id: admin?._id,
        name: `Admin: ${admin?.username || "System Admin"}`,
        method: adminPayout?.type ? adminPayout.type.charAt(0).toUpperCase() + adminPayout.type.slice(1) : "Bank Transfer",
        accountNumber: adminPayout?.details?.get('accountNumber') || adminPayout?.details?.get('number') || "Not provided",
        bankName: adminPayout?.details?.get('bankName') || adminPayout?.details?.get('name') || "Not specified",
        amount: 50
      },
      sponsor: {
        id: sponsor?._id,
        name: `Sponsor: ${sponsor?.username || "No Sponsor"}`,
        method: sponsorPayout?.type ? sponsorPayout.type.charAt(0).toUpperCase() + sponsorPayout.type.slice(1) : "Not set",
        accountNumber: sponsorPayout?.details?.get('accountNumber') || sponsorPayout?.details?.get('number') || "Not provided",
        bankName: sponsorPayout?.details?.get('bankName') || sponsorPayout?.details?.get('name') || "Not specified",
        amount: 500
      }
    };

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
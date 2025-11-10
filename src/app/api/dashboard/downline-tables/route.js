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

    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all referrals for current user
    const allReferrals = await User.find({
      referredBy: currentUser.username,
      status: "fully_active"
    }).sort({ createdAt: 1 });

    // Table 1: 1st Sale (Qualifying Sale - Passed Up)
    const firstSale = allReferrals.length > 0 ? [allReferrals[0]] : [];
    const qualifyingSales = firstSale.map((user, index) => ({
      sr: index + 1,
      name: user.name || user.username,
      username: user.username,
      email: user.email,
      originalSponsor: currentUser.name || currentUser.username,
      saleType: "Qualifying (1st Sale)",
      passedUpTo: currentUser.referredBy || "Admin",
      status: "Active",
      joinedAt: user.createdAt
    }));

    // Table 2: Direct Referrals (2nd sale onwards)
    const directSales = allReferrals.slice(1).map((user, index) => ({
      sr: index + 2,
      name: user.name || user.username,
      username: user.username,
      email: user.email,
      sponsorName: currentUser.name || currentUser.username,
      saleType: "Direct",
      status: "Active",
      joinedAt: user.createdAt
    }));

    // Table 3: Pass-up Sales (1st sales from direct referrals)
    const passUpSales = [];
    if (currentUser.passupSales && currentUser.passupSales.length > 0) {
      const passUpUsers = await User.find({
        _id: { $in: currentUser.passupSales },
        status: "fully_active"
      });

      for (let i = 0; i < passUpUsers.length; i++) {
        const user = passUpUsers[i];
        // Find who originally sponsored this user
        const originalSponsor = await User.findOne({ username: user.referredBy });
        
        passUpSales.push({
          sr: i + 1,
          name: user.name || user.username,
          username: user.username,
          email: user.email,
          originalSponsor: originalSponsor?.name || originalSponsor?.username || "Unknown",
          saleType: "Pass Up",
          status: "Active",
          joinedAt: user.createdAt
        });
      }
    }

    return NextResponse.json({
      qualifyingSales,
      directSales,
      passUpSales
    });

  } catch (error) {
    console.error("Downline tables error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
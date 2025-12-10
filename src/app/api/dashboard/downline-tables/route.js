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

    // Get first sale locked by information
    const firstSaleLockedBy = currentUser.firstSaleLockedBy ? 
      await User.findById(currentUser.firstSaleLockedBy) : null;
      const passupSponsor = await User.findById(currentUser.passupSponsor)
      const firstSalePassedUpTo= currentUser.passupSponsor ?  passupSponsor.username : currentUser.referredBy;

    // Table 1: 1st Sale (Qualifying Sale - Passed Up)
    const qualifyingSales = [];
    if (firstSaleLockedBy) {
      qualifyingSales.push({
        sr: 1,
        name: firstSaleLockedBy.name || firstSaleLockedBy.username,
        username: firstSaleLockedBy.username,
        email: firstSaleLockedBy.email,
        originalSponsor: currentUser.name || currentUser.username,
        saleType: "Qualifying (1st Sale)",
        passedUpTo: firstSalePassedUpTo || "Unknown",
        status: "Active",
        joinedAt: firstSaleLockedBy.createdAt
      });
    }

    // Table 2: Direct Referrals (2nd sale onwards)
    let directSales = [];
    if(currentUser.directSales && currentUser.directSales.length > 0){
      const directSaleUsers = await User.find({
        _id: { $in: currentUser.directSales },
        status: "fully_active"
      });
      
      directSales = directSaleUsers.map((user, index) => ({
        sr: index + 2,
        name: user.name || user.username,
        username: user.username,
        email: user.email,
        sponsorName: currentUser.name || currentUser.username,
        saleType: "Direct",
        status: "Active",
        joinedAt: user.createdAt
      }));
    }
    // Table 3: Pass-up Sales (1st sales from direct referrals)
    let passUpSales = [];
    if (currentUser.passupSales && currentUser.passupSales.length > 0) {
      const passUpUsers = await User.find({
        _id: { $in: currentUser.passupSales },
        status: "fully_active"
      });

      passUpSales = passUpUsers.map((user, index) => ({
        sr: index + 1,
        name: user.name || user.username,
        username: user.username,
        email: user.email,
        originalSponsor: user.referredBy || "Unknown",
        saleType: "Pass Up",
        status: "Active",
        joinedAt: user.createdAt
      }));
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
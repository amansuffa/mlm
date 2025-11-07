import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

/**
 * Payment Lock/Unlock API
 * Manages real-time lock system for sponsor's first sale
 * 
 * POST body:
 * {
 *   userId: string,
 *   sponsorId: string (optional - will be fetched from user),
 *   action: "lock" | "unlock"
 * }
 */
export async function POST(req) {
  try {
    await connectDB();
    
    // Handle both regular JSON and sendBeacon (Blob) requests
    let body;
    const contentType = req.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      body = await req.json();
    } else {
      // Handle sendBeacon Blob data
      const blob = await req.blob();
      const text = await blob.text();
      body = JSON.parse(text);
    }
    
    const { userId, sponsorId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing userId or action" },
        { status: 400 }
      );
    }

    if (action !== "lock" && action !== "unlock") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'lock' or 'unlock'" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get sponsor
    let sponsor;
    if (sponsorId) {
      sponsor = await User.findById(sponsorId);
    } else {
      sponsor = await User.findOne({ username: user.referredBy });
    }

    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    // Handle lock/unlock action
    if (action === "lock") {
      // Set lock only if sponsor doesn't have first sale yet
      if (!sponsor.hasFirstSale) {
        sponsor.firstSaleLocked = true;
        sponsor.firstSaleLockedBy = user._id;
        sponsor.firstSaleLockedAt = new Date();
        await sponsor.save();
      }
    } else if (action === "unlock") {
      // Unlock only if locked by the same user
      if (
        sponsor.firstSaleLocked &&
        sponsor.firstSaleLockedBy?.toString() === userId
      ) {
        sponsor.firstSaleLocked = false;
        sponsor.firstSaleLockedBy = null;
        sponsor.firstSaleLockedAt = null;
        await sponsor.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sponsor lock ${action === "lock" ? "set" : "removed"} successfully`,
      sponsor: {
        id: sponsor._id,
        username: sponsor.username,
        firstSaleLocked: sponsor.firstSaleLocked,
        firstSaleLockedBy: sponsor.firstSaleLockedBy,
      },
    });
  } catch (error) {
    console.error("Error in payment-lock API:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}


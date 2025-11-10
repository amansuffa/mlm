import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

/**
 * Payment Details API
 * Returns payment recipient information based on lock status and transaction history
 * 
 * Logic:
 * 1. If user has pending transaction → return same sponsor from transaction
 * 2. If sponsor.firstSaleLocked == true:
 *    - If locked by current user → return sponsor's sponsor (1-up pass-up)
 *    - Else → return sponsor (someone else locked it)
 * 3. If sponsor.hasFirstSale == true → return sponsor
 * 4. Else → return sponsor's sponsor (1-up pass-up)
 */
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

    // Get sponsor
    const sponsor = await User.findOne({ username: user.referredBy });
    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    let recipientUser = null;
    let recipientLabel = "No Sponsor";

    // Step 2: Check if sponsor's first sale is locked
   if (sponsor.firstSaleLocked) {
      // Check if locked by current user
      if (
        sponsor.firstSaleLockedBy &&
        sponsor.firstSaleLockedBy.toString() == userId
      ) {
        // Locked by current user → 1-up pass-up
        const sponsorUpline = await User.findOne({
          username: sponsor.referredBy,
        });
        if (sponsorUpline) {
          recipientUser = sponsorUpline;
          recipientLabel = `Sponsor (1-Up Pass-Up): ${
            sponsorUpline.username || "Not found"
          }`;
        } else {
          // No sponsor upline → fallback to sponsor
          recipientUser = sponsor;
          recipientLabel = `Sponsor (Direct): ${sponsor.username || "Not found"}`;
        }
      } else {
        // Locked by someone else → return sponsor
        recipientUser = sponsor;
        recipientLabel = `Sponsor (Direct): ${
          sponsor.username || "Not found"
        }`;
      }
    }
    // Step 3: Check if sponsor already has first sale
    else if (sponsor.hasFirstSale) {
      recipientUser = sponsor;
      recipientLabel = `Sponsor (Direct): ${sponsor.username || "Not found"}`;
    }
    // Step 4: Default → 1-up pass-up
    else {
      const sponsorUpline = await User.findOne({
        username: sponsor.referredBy,
      });
      if (sponsorUpline) {
        recipientUser = sponsorUpline;
        recipientLabel = `Sponsor (1-Up Pass-Up): ${
          sponsorUpline.username || "Not found"
        }`;
      } else {
        // No sponsor upline → fallback to sponsor
        recipientUser = sponsor;
        recipientLabel = `Sponsor (Direct): ${sponsor.username || "Not found"}`;
      }
    }

    // Get payout method
    const recipientPayout =
      recipientUser?.payoutMethods?.find((method) => method.isPrimary) ||
      recipientUser?.payoutMethods?.[0];

    const paymentDetails = {
      sponsor: {
        id: recipientUser?._id || null,
        name: recipientUser?.name || "Not found",
        label: recipientLabel,
        method:
          recipientPayout?.methodName || recipientPayout?.type || "Not set",
        details: recipientPayout?.details || "Not provided",
        amount: 500,
      },
    };

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

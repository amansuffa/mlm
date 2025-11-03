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

    // Fee Distribution Logic - Correct recipient calculate karna
    // Pehla invite → referrer ke sponsor ko (1-up pass-up)
    // Doosra+ invite → direct referrer ko
    
    let recipientUser = null;
    let recipientLabel = "No Sponsor";

    if (user.referredBy) {
      // Direct referrer find karo
      const directReferrer = await User.findOne({ username: user.referredBy })
        .select('username referredBy directInvitesCount payoutMethods');
      
      if (directReferrer) {
        const inviteCount = directReferrer.directInvitesCount || 0;
        
        if (inviteCount === 0 && directReferrer.referredBy) {
          // Pehla invite hai - 1-Up Pass-Up
          // Fee referrer ke sponsor ko jayegi
          recipientUser = await User.findOne({ username: directReferrer.referredBy })
            .select('username payoutMethods');
          recipientLabel = `Sponsor (1-Up): ${recipientUser?.username || "Not found"}`;
        } else {
          // Doosra ya usse zyada invite hai
          // Fee direct referrer ko jayegi
          recipientUser = directReferrer;
          recipientLabel = `Sponsor (Direct): ${directReferrer.username}`;
        }
      } else {
        // Direct referrer nahi mila - fallback to old logic
        recipientUser = await User.findOne({ username: user.referredBy })
          .select('username payoutMethods');
        recipientLabel = `Sponsor: ${recipientUser?.username || "Not found"}`;
      }
    }
    
    // Payout method find karo
    const recipientPayout = recipientUser?.payoutMethods?.find(method => method.isPrimary) || recipientUser?.payoutMethods?.[0];

    const paymentDetails = {
      sponsor: {
        id: recipientUser?._id || null,
        name: recipientLabel,
        method: recipientPayout?.methodName || recipientPayout?.type || "Not set",
        accountNumber: recipientPayout?.details || recipientPayout?.details?.get?.('accountNumber') || recipientPayout?.details?.get?.('number') || "Not provided",
        bankName: recipientPayout?.methodName || recipientPayout?.details?.get?.('bankName') || recipientPayout?.details?.get?.('name') || "Not specified",
        amount: 500
      }
    };

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
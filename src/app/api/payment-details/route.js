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
      const directReferrer = await User.findOne({ username: user.referredBy });
      
      if (directReferrer) {
        const inviteCount = directReferrer.directInvitesCount || 0;
        
        if (inviteCount === 0 && directReferrer.referredBy) {
          // Pehla invite hai - 1-Up Pass-Up
          // Fee referrer ke sponsor ko jayegi
          recipientUser = await User.findOne({ username: directReferrer.referredBy });
          recipientLabel = `Sponsor (1-Up): ${recipientUser?.username || "Not found"}`;
        } else {
          // Doosra ya usse zyada invite hai
          // Fee direct referrer ko jayegi
          recipientUser = directReferrer;
          recipientLabel = `Sponsor (Direct): ${directReferrer.username}`;
        }
      } else {
        // Direct referrer nahi mila - fallback to old logic
        recipientUser = await User.findOne({ username: user.referredBy });
        recipientLabel = `Sponsor: ${recipientUser?.username || "Not found"}`;
      }
    }
    
    // Payout method find karo
    const recipientPayout = recipientUser?.payoutMethods?.find(method => method.isPrimary) || recipientUser?.payoutMethods?.[0];

    const paymentDetails = {
      sponsor: {
        id: recipientUser?._id || null,
        name: recipientUser?.name || "Not found",
        label: recipientLabel,
        method: recipientPayout?.methodName || recipientPayout?.type || "Not set",
        details: recipientPayout?.details || "Not provided",
       
        amount: 500
      }
    };

    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
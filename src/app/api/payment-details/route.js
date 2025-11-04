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

    // const sponsor = await User.findById(user.sponsor);
    const sponsor = await User.findOne({ username: user.referredBy });

    if (!sponsor) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const LOCK_DURATION = 1000 * 60 * 30; // 30 minutes

    if (sponsor.firstSaleLocked && sponsor.firstSaleLockedAt) {
      const timeElapsed =
        Date.now() - new Date(sponsor.firstSaleLockedAt).getTime();
      if (timeElapsed > LOCK_DURATION) {
        // auto unlock
        sponsor.firstSaleLocked = false;
        sponsor.firstSaleLockedBy = null;
        sponsor.firstSaleLockedAt = null;
        await sponsor.save();
      }
    }


    // Pehla invite → referrer ke sponsor ko (1-up pass-up)
    // Doosra+ invite → direct referrer ko

    let recipientUser = null;
    let recipientLabel = "No Sponsor";

    if (sponsor.hasFirstSale || sponsor.firstSaleLocked) {
      // sponsor already has or pending first sale
      recipientUser = sponsor;
      recipientLabel = `Sponsor (Direct): ${
        recipientUser?.username || sponsor.username || "Not found"
      }`;
    } else {
      // const sponsorUpline = await User.findById(sponsor.sponsorId);
      const sponsorUpline = await User.findOne({
        username: sponsor.referredBy,
      });
if (!sponsorUpline) {recipientUser = sponsor;
      recipientLabel = `Sponsor (Direct): ${
        recipientUser?.username || sponsor.username || "Not found"
      }`;}

    if (sponsorUpline) {    sponsor.firstSaleLocked = true;
      sponsor.firstSaleLockedBy = user._id;
      sponsor.firstSaleLockedAt = new Date();
      await sponsor.save();


      recipientUser = sponsorUpline;
      recipientLabel = `Sponsor (1-Up Pass-Up): ${
        recipientUser?.username || sponsorUpline.username || "Not found"
      }`;}
    }

    // Payout method find karo
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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

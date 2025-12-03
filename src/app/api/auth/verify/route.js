import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";
import { EmailTemplate } from "@/models/EmailTemplate";
import { parseTemplate } from "@/lib/parseTemplate";
import { buildTemplateData } from "@/utils/emailTemplateData";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/verify?status=fail&reason=no_token", req.url));
    }

    // First try to find by token
    let user = await User.findOne({ verificationToken: token });

    if (!user) {
      // If not found by token, check if any user has this token but is already verified
      user = await User.findOne({ isVerified: true });
      if (user) {
        return NextResponse.redirect(new URL("/verify?status=already&reason=already_verified", req.url));
      }
      return NextResponse.redirect(new URL("/verify?status=fail&reason=expired_or_invalid", req.url));
    }

    // If user found but already verified
    if (user.isVerified) {
      return NextResponse.redirect(new URL("/verify?status=already&reason=already_verified", req.url));
    }

    // Valid token and user not verified yet
    user.isVerified = true;
    user.verificationToken = null; // Clear the token after verification
    await user.save();

    const userTemplate = await EmailTemplate.findOne({ type: "user_welcome" });
    const sponsor = await User.findOne({ username: user.referredBy });
        const adminFeeLink = `${process.env.NEXTAUTH_URL}/payment?uid=${user._id}`;

        const templateData = buildTemplateData(user,{
          MemberFirstName: user.firstName || user.name?.split(' ')[0] || 'Member',
          MemberName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
          MemberEmail: user.email,
          MemberUsername: user.username,
          SponsorName: sponsor?.name || 'N/A',
          AdminFeeLink: adminFeeLink
        });
        
        // Send email to user
        if (userTemplate) {
          const userHtml = parseTemplate(userTemplate.body, templateData);
          await sendEmail(user.email, userTemplate.subject, userHtml);
        }

    return NextResponse.redirect(new URL(`/payment?uid=${user._id}`, req.url));

  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.redirect(new URL("/verify?status=fail&reason=server_error", req.url));
  }
}
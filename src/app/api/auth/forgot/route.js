import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";
import { EmailTemplate } from "@/models/EmailTemplate";
import { parseTemplate } from "@/lib/parseTemplate";

function generateResetToken() {
  return crypto.randomBytes(20).toString("hex");
}

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    const token = generateResetToken();
    user.resetPasswordToken = token;
    // 1 hour expiry
    user.resetPasswordExpires = Date.now() + 3600 * 1000;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_NEXTAUTH_URL}/reset-password?token=${token}`;

    const template = await EmailTemplate.findOne({ type: "reset_password" });
    let html;
    if (template) {
      html = parseTemplate(template.body, {
        FirstName: user.firstName || user.name,
        MemberFullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name,
        MemberEmail: user.email,
        ResetLink: resetUrl,
        UnsubscribeToken: user.unsubscribeToken,
      });
    } else {
      html = `
        <h2>Hello ${user.firstName || user.name},</h2>
        <p>You recently requested to reset your password. Click the button below to set a new password. This link will expire in 1 hour.</p>
        <p><a href="${resetUrl}" style="padding:12px 24px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
        <p>If you didn't request a password reset, you can ignore this email.</p>
        <p>Or copy and paste this link: ${resetUrl}</p>
      `;
    }

    try {
      await sendEmail(user.email, template?.subject || "Reset your password", html);
      console.log(`✅ Password reset email sent to ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed to send reset email to ${user.email}:`, err);
      throw err;
    }

    return NextResponse.json({ message: "Reset email sent", status: "email_sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { EmailTemplate } from "@/models/EmailTemplate";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";
import { parseTemplate } from "@/lib/parseTemplate";

function generateVerificationToken() {
  return crypto.randomBytes(20).toString("hex");
}

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { 
          message: "Email already verified", 
          status: "already_verified" 
        },
        { status: 200 }
      );
    }

    // Generate new verification token
    const token = generateVerificationToken();
    user.verificationToken = token;
    await user.save();

    // Get the verification email template
    const template = await EmailTemplate.findOne({ type: "verification" });
    
    let html;
    if (template) {
      // Use the template if it exists
      const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;
      html = parseTemplate(template.body, {
        FirstName: user.firstName || user.name,
        MemberFullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name,
        MemberEmail: user.email,
        VerificationLink: verifyUrl,
        UnsubscribeToken: user.unsubscribeToken,
      });
    } else {
      // Fallback to basic email if no template exists
      const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;
      html = `
        <h2>Hello ${user.firstName || user.name},</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${verifyUrl}" style="padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
        <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
        <p>${verifyUrl}</p>
        <p>This link will expire for security reasons. If you need a new verification link, you can request one through the website.</p>
      `;
    }

    try {
      await sendEmail(
        email,
        template?.subject || "Verify Your Email Address",
        html
      );
      console.log(`✅ Resend verification email sent to ${email}`);
    } catch (emailError) {
      console.error(`❌ Failed to resend verification email to ${email}:`, emailError);
      throw emailError;
    }

    return NextResponse.json({
      message: "Verification email sent successfully",
      status: "email_sent"
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { 
        error: "Failed to send verification email. Please try again later." 
      },
      { status: 500 }
    );
  }
}
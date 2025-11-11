import { NextResponse } from "next/server";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";
import { EmailTemplate } from "@/models/EmailTemplate";
import { parseTemplate } from "@/lib/parseTemplate";


export async function POST(req) {
  try {
    const { email, password, name, username, referredBy } = await req.json();
    await connectDB();

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    user = await User.findOne({ username });
    if (user) {
      return NextResponse.json(
        { error: "Username is not available" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 5);

    // If no referredBy, set to admin's username
    let finalReferredBy = referredBy;
    if (!referredBy) {
      const admin = await User.findOne({ role: "admin" });
      finalReferredBy = admin ? admin.username : null;
    } else {
      // Verify that the referrer exists
      const referrer = await User.findOne({ username: referredBy });
      if (!referrer) {
        return NextResponse.json(
          { error: "Invalid referral username" },
          { status: 400 }
        );
      }
    }
    const token = crypto.randomBytes(20).toString("hex");

    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      referredBy: finalReferredBy,
      isVerified: false,
      verificationToken: token,
    });

 

    // verification link
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;
    // Find email reciever
    const sponsor = await User.findOne({ username: finalReferredBy });
    const admin = await User.findOne({ role: "admin" });
    // Find email templates
    const userTemplate = await EmailTemplate.findOne({ type: "user_confirm_email" });
    const sponsorTemplate = await EmailTemplate.findOne({ type: "sponsor_new_referral" });
    const adminTemplate = await EmailTemplate.findOne({ type: "admin_new_signup" });
    
    const templateData = {
      MemberFirstName: name,
      MemberName: name,
      MemberEmail: email,
      MemberUsername: username,
      SponsorName: sponsor?.name || 'N/A',
      SponsorFirstName: sponsor?.firstName || 'N/A',
      VerificationLink: verifyUrl,
      ConfirmEmailLink: verifyUrl
    };
    
    // Send email to user
    if (userTemplate) {
      const userHtml = parseTemplate(userTemplate.body, templateData);
      await sendEmail(email, userTemplate.subject, userHtml);
    }
    
    // Send email to sponsor
    if (sponsorTemplate && sponsor) {
      const sponsorHtml = parseTemplate(sponsorTemplate.body, templateData);
      await sendEmail(sponsor.email, sponsorTemplate.subject, sponsorHtml);
    }
    
    // Send email to admin
    if (adminTemplate && admin) {
      const adminHtml = parseTemplate(adminTemplate.body, templateData);
      await sendEmail(admin.email, adminTemplate.subject, adminHtml);
    }
    
    // Fallback if no user template exists
    if (!userTemplate) {
      const defaultHtml = `
        <h2>Verify Your Email</h2>
        <p>Hi ${name},</p>
        <p>Thanks for signing up! Please click the link below to verify your email:</p>
        <a href="${verifyUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verifyUrl}</p>
        <p>If you didn't create an account, you can ignore this email.</p>
      `;
      await sendEmail(email, "Verify your email", defaultHtml);
    }
        

  

  

    return NextResponse.json(
      {
        message: "Signup successful",
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          username: newUser.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

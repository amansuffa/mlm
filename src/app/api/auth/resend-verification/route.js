import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "User already verified" }, { status: 400 });
    }

    // generate new token
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    await user.save();

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

    await transporter.sendMail({
      from: `"MLM App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Resend Email Verification",
      html: `<h2>Hello ${user.name},</h2>
             <p>Here’s a new link to verify your email:</p>
             <a href="${verifyUrl}" target="_blank">Verify Email</a>`,
    });

    return NextResponse.json({ message: "Verification email resent" }, { status: 200 });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

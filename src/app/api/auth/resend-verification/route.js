import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";


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

  

    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;
const html = `<h2>Hello ${user.name},</h2>
             <p>Here’s a new link to verify your email:</p>
             <a href="${verifyUrl}" target="_blank">Verify Email</a>`;


      await sendEmail(email, "Resend Email Verification", html);
    

    return NextResponse.json({ message: "Verification email resent" }, { status: 200 });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

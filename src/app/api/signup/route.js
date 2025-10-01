import { NextResponse } from "next/server";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import crypto from "crypto";
import nodemailer from "nodemailer";


export async function POST(req) {
  try {
    const { email, password, name,username, referredBy } = await req.json();
    await connectDB();

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
 user = await User.findOne({ username });
    if (user) {
      return NextResponse.json({ error: "Username is not available" }, { status: 400 });
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
        return NextResponse.json({ error: "Invalid referral username" }, { status: 400 });
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
  verificationToken :token
    });

    // transporter config
const transporter = nodemailer.createTransport({
  service: "gmail", // ya smtp.mailtrap.io
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// verification link
const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

await transporter.sendMail({
  to: email,
  subject: "Verify Your Account",
  html: `<h3>Hello ${name},</h3>
         <p>Click below to verify your account:</p>
         <a href="${verifyUrl}">Verify Email</a>`,
});


    return NextResponse.json(
      {
        message: "Signup successful",
        user: { id: newUser._id, email: newUser.email, name: newUser.name, username: newUser.username },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

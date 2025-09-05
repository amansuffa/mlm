import { NextResponse } from "next/server";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { email, password, name, referredBy } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const referralId = Math.random().toString(36).substring(2, 10);

    // ✅ If no referredBy, set to admin's referralId
    let finalReferredBy = referredBy;
    if (!referredBy) {
      const admin = await User.findOne({ role: "admin" }); // assuming role field for admin
      finalReferredBy = admin ? admin.referralId : null;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      referralId,
      referredBy: finalReferredBy
    });

    return NextResponse.json(
      {
        message: "Signup successful",
        user: { id: newUser._id, email: newUser.email, name: newUser.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

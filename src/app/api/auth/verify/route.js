import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/verify?status=fail&reason=no_token", req.url));
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.redirect(new URL("/verify?status=fail&reason=invalid_token", req.url));
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.redirect(new URL(`/payment?uid=${user._id}`, req.url));

  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.redirect(new URL("/verify?status=fail&reason=server_error", req.url));
  }
}
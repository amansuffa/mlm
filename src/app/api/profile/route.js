import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received update data:", body);

    // Check for banned countries
    const bannedCountries = ["Pakistan", "Somalia", "Sudan", "Democratic Republic of Congo", "Yemen"];
    if (body.address?.country && bannedCountries.includes(body.address.country)) {
      return NextResponse.json(
        { error: "Profile updates not available for your country due to regulatory restrictions" },
        { status: 400 }
      );
    }

    // Build update object safely
    const updateFields = {
      name: body.name || "",
      firstName: body.firstName || "",
      middleName: body.middleName || "",
      lastName: body.lastName || "",
      profilePicture: body.profilePicture || "",
      phone: {
        countryCode: body.phone?.countryCode || "",
        number: body.phone?.number || "",
      },
      address: {
        country: body.address?.country || "",
        province: body.address?.province || "",
        city: body.address?.city || "",
      },
      socialMedia: {
        facebook: body.socialMedia?.facebook || "",
        instagram: body.socialMedia?.instagram || "",
        tiktok: body.socialMedia?.tiktok || "",
        whatsapp: body.socialMedia?.whatsapp || "",
      },
    };

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

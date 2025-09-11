import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    // ✅ Only allow status & role to be updated
    const allowedFields = ["status", "role"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (body[field] && typeof body[field] === "string" && body[field].trim() !== "") {
        updateData[field] = body[field].trim();
      }
    });

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Only status and role can be updated" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

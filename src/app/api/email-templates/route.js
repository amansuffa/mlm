import { NextResponse } from "next/server";
import { EmailTemplate } from "@/models/EmailTemplate";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";

export async function GET(req) {
  await connectDB();
  const session = await auth();
  console.log("session", session.user);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const templates = await EmailTemplate.find().sort({ createdAt: -1 });
  return NextResponse.json(templates);
}

export async function POST(req) {
  await connectDB();
  const session = await auth();
  console.log("session", session.user);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    const newTemplate = await EmailTemplate.create(data);
    return NextResponse.json(newTemplate);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
export async function PUT(req) {
  await connectDB();
  const session = await auth();
  console.log("session", session.user);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id, ...data } = await req.json();
    const updated = await EmailTemplate.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
export async function DELETE(req) {
  await connectDB();
  const session = await auth();
  console.log("session", session.user);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  try {
    const { id } = await req.json();
    await EmailTemplate.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

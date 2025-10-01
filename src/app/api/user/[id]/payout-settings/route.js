import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req,  context ) {


  await connectDB();
  const { id } = await context.params;
  const user = await User.findById(id).select("payoutMethods");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user.payoutMethods);
}

export async function POST(req,  context ) {
  await connectDB();
  const { id } = await context.params;
  const body = await req.json();
  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (body.isPrimary) {
    user.payoutMethods.forEach((m) => (m.isPrimary = false));
  }

  user.payoutMethods.push(body);
  await user.save();

  return NextResponse.json(user.payoutMethods);
}

export async function PUT(req, context ) {
    const { id } = await context.params;
  await connectDB();
  const { index, updatedMethod } = await req.json();
  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (updatedMethod.isPrimary) {
    user.payoutMethods.forEach((m) => (m.isPrimary = false));
  }

  user.payoutMethods[index] = { ...user.payoutMethods[index]._doc, ...updatedMethod };
  await user.save();

  return NextResponse.json(user.payoutMethods);
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { index } = await req.json();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const method = user.payoutMethods[index];
    if (!method) {
      return NextResponse.json({ error: "Payout method not found" }, { status: 404 });
    }

    // 🚨 Prevent deleting primary if no other primary exists
    if (method.isPrimary) {
      const hasAnotherPrimary = user.payoutMethods.some(
        (m, i) => i !== index && m.isPrimary
      );

      if (!hasAnotherPrimary) {
        return NextResponse.json(
          { error: "Cannot delete primary method. Please set another payout method as primary first." },
          { status: 400 }
        );
      }
    }

    // ✅ Safe to delete
    user.payoutMethods.splice(index, 1);
    await user.save();

    return NextResponse.json(user.payoutMethods);
  } catch (error) {
    console.error("Delete payout method error:", error);
    return NextResponse.json(
      { error: "Failed to delete payout method" },
      { status: 500 }
    );
  }
}


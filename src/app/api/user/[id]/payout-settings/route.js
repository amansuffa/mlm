import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const user = await User.findById(id).select("payoutMethods");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Return empty array if payoutMethods doesn't exist
    return NextResponse.json(user.payoutMethods || []);
  } catch (error) {
    console.error('GET payout methods error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req,  context ) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Create the payout method object with only needed fields
    const payoutMethod = {
      methodName: body.methodName,
      details: body.details,
      isPrimary: body.isPrimary
    };

    if (payoutMethod.isPrimary) {
      user.payoutMethods.forEach((m) => (m.isPrimary = false));
    }

    user.payoutMethods.push(payoutMethod);
    await user.save();

    return NextResponse.json(user.payoutMethods);
  } catch (error) {
    console.error('POST payout method error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context ) {
  try {
    const { id } = await context.params;
    await connectDB();
    const { index, updatedMethod } = await req.json();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.payoutMethods[index]) {
      return NextResponse.json({ error: "Payout method not found" }, { status: 404 });
    }

    // Create the updated method object with only needed fields
    const payoutMethod = {
      methodName: updatedMethod.methodName,
      details: updatedMethod.details,
      isPrimary: updatedMethod.isPrimary
    };

    if (payoutMethod.isPrimary) {
      user.payoutMethods.forEach((m) => (m.isPrimary = false));
    }

    user.payoutMethods[index] = payoutMethod;
    await user.save();

    return NextResponse.json(user.payoutMethods);
  } catch (error) {
    console.error('PUT payout method error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const { index } = await req.json();

    await connectDB();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.payoutMethods[index]) {
      return NextResponse.json({ error: "Payout method not found" }, { status: 404 });
    }

    // If deleting the primary method, make the first remaining method primary
    const deletedMethod = user.payoutMethods[index];
    user.payoutMethods.splice(index, 1);
    
    if (deletedMethod.isPrimary && user.payoutMethods.length > 0) {
      user.payoutMethods[0].isPrimary = true;
    }

    await user.save();
    return NextResponse.json(user.payoutMethods);
  } catch (error) {
    console.error('DELETE payout method error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


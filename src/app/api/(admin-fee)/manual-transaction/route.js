

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { auth } from "@/auth";


export async function POST(req) {
  await connectDB();
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { sender, amount, type, method, note, image } = body;

    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }
 const receiver = adminUser._id;

    if (!sender || !receiver || !amount || !type)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const newTx = await Transaction.create({
      fromUser: sender,
      toUser: receiver,
      amount,
      type,
      method,
      note,
      image,
      status: "pending",
    });

    // (Optional) Notification can be created here later
    // await Notification.create({
    //   user: receiver,
    //   message: `New payment of $${amount} received from ${session.user.name}`,
    //   link: `/transactions`,
    // });

    return NextResponse.json({ success: true, data: newTx });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


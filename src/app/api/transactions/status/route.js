import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { auth } from "@/auth"; 


export async function POST(req) {
  await connectDB();
   const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  // const { userId } = await session.user.id;
const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const transactions = await Transaction.find({ fromUser: userId });
console.log("Transactions found:", transactions);
  const adminTx = transactions.find(tx => tx.type === "admin");
  const membershipTx = transactions.find(tx => tx.type === "membership");

  return NextResponse.json({
    adminStatus: adminTx ? adminTx.status : "none",
    membershipStatus: membershipTx ? membershipTx.status : "none",
    // transactions: transactions
  });
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";

export async function GET() {
  await connectDB();
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const username = session.user.username;
  const role = session.user.role;

  let kpis = {
    directSales: 0,
    passupSales: 0,
    totalSales: 0,
    totalEarnings: 0,
    currentRank: session.user.rank || "Bronze",
  };

  // if (role === "admin") {
  //   // ✅ Admin — show total platform stats
  //   const allUsers = await User.find({ role: "user" });

  //   const totalDirectSales = allUsers.reduce(
  //     (sum, u) => sum + (u.directSales?.length || 0),
  //     0
  //   );
  //   const totalPassupSales = allUsers.reduce(
  //     (sum, u) => sum + (u.passupSales?.length || 0),
  //     0
  //   );
  //   const totalEarnings = allUsers.reduce(
  //     (sum, u) => sum + (u.earnings?.total || 0),
  //     0
  //   );

  //   kpis.directSales = totalDirectSales;
  //   kpis.passupSales = totalPassupSales;
  //   kpis.totalSales = totalDirectSales + totalPassupSales;
  //   kpis.totalEarnings = `$${totalEarnings}`;
  // } else {
    // ✅ Regular user — show personal KPIs
    const currentUser = await User.findOne({ username }).select(
      "directSales passupSales earnings"
    );

    const directSales = currentUser?.directSales?.length || 0;
    const passupSales = currentUser?.passupSales?.length || 0;
    const totalSales = directSales + passupSales;
    const totalEarnings = currentUser?.earnings?.total || 0;

    kpis.directSales = directSales;
    kpis.passupSales = passupSales;
    kpis.totalSales = totalSales;
    kpis.totalEarnings = `$${totalEarnings}`;
  // }

  return NextResponse.json(kpis);
}

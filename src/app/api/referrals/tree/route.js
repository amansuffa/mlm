import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

async function buildReferralTree(username) {
  console.log("Building tree for username:", username);
  const user = await User.findOne({ username }).select("name username status");
  if (!user) {
    console.log("No user found for username:", username);
    return null;
  }

  console.log("Found user:", user);
  const directReferrals = await User.find({ referredBy: username }).select("name username status");
  console.log("Direct referrals found:", directReferrals.length, directReferrals);

  const children = await Promise.all(
    directReferrals.map(async (referral) => {
      return await buildReferralTree(referral.username);
    })
  );

  const result = {
    name: user.name || user.username,
    username: user.username,
    referral_type: user.status === "fully_active" ? "green" : "red",
    children: children.filter(Boolean)
  };
  
  console.log("Returning tree node for", username, ":", result);
  return result;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const treeData = await buildReferralTree(currentUser.username);
    const formattedTree = [{
      ...treeData,
      name: `${treeData.name} (You)`,
      referral_type: "blue"
    }];

    console.log("Final formatted tree data:", formattedTree);


    return NextResponse.json({ treeData: formattedTree });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
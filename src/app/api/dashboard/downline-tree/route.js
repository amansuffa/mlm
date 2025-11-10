import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(session.user.id)
      .populate("directSales", "name username status directSales passupSales")
      .populate("passupSales", "name username status directSales passupSales");

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build tree recursively
    const buildTree = async (user, visited = new Set()) => {
      if (visited.has(user._id.toString())) {
        return null; // Prevent infinite loops
      }
      visited.add(user._id.toString());

      const children = [];
      
      // Add direct sales (green)
      if (user.directSales && user.directSales.length > 0) {
        for (const directSale of user.directSales) {
          if (directSale.status === "fully_active") {
            const childNode = await buildTree(directSale, new Set(visited));
            if (childNode) {
              childNode.referral_type = "green";
              children.push(childNode);
            }
          }
        }
      }

      // Add passup sales (red)
      // if (user.passupSales && user.passupSales.length > 0) {
      //   for (const passupSale of user.passupSales) {
      //     if (passupSale.status === "fully_active") {
      //       const childNode = await buildTree(passupSale, new Set(visited));
      //       if (childNode) {
      //         childNode.referral_type = "red";
      //         children.push(childNode);
      //       }
      //     }
      //   }
      // }

      // Add other fully active referrals (blue)
      const otherReferrals = await User.find({
        referredBy: user.username,
        status: "fully_active",
        _id: { 
          $nin: [
            ...(user.directSales || []).map(ds => ds._id),
            ...(user.passupSales || []).map(ps => ps._id)
          ]
        }
      });

      for (const referral of otherReferrals) {
        const childNode = await buildTree(referral, new Set(visited));
        if (childNode) {
          childNode.referral_type = "red";
          children.push(childNode);
        }
      }

      return {
        name: user.name || user.username,
        username: user.username,
        referral_type: user._id.toString() === session.user.id ? "blue" : "blue",
        children: children.length > 0 ? children : undefined
      };
    };

    const treeData = await buildTree(currentUser);

    return NextResponse.json([treeData]);

  } catch (error) {
    console.error("Downline tree error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
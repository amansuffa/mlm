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
      .populate("directSales", "name username status")
      .populate("passupSales", "name username status");

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build tree recursively
    const buildTree = async (user, visited = new Set()) => {
      if (visited.has(user._id.toString())) {
        return null;
      }
      visited.add(user._id.toString());

      const children = [];
      
      // Get all referrals of this user
      const allReferrals = await User.find({
        referredBy: user.username,
        status: "fully_active"
      });

      for (const referral of allReferrals) {
        const childNode = await buildTree(referral, new Set(visited));
        if (childNode) {
          // Determine color based on relationship to current user
          let referralType;
          
          // Check if locked by current user AND referred by current user (blue)
          if (currentUser.firstSaleLockedBy && currentUser.firstSaleLockedBy.toString() === referral._id.toString() && referral.referredBy === currentUser.username) {
            referralType = "blue";
          }
          // Check if in direct sales AND referred by current user (green)
          else if (currentUser.directSales && currentUser.directSales.some(ds => ds._id.toString() === referral._id.toString()) && referral.referredBy === currentUser.username) {
            referralType = "green";
          }
          // Check if in passup sales (red)
          else if (currentUser.passupSales && currentUser.passupSales.some(ps => ps._id.toString() === referral._id.toString())) {
            referralType = "red";
          }
          // Use gray only if none of the above match
          else {
            referralType = "gray";
          }
          
          childNode.referral_type = referralType;
          children.push(childNode);
        }
      }

      return {
        name: user.name || user.username,
        username: user.username,
        referral_type: user._id.toString() === session.user.id ? "purple" : "blue",
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
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { EmailTemplate } from "@/models/EmailTemplate";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { sendEmail } from "@/lib/sendEmail";
import { parseTemplate } from "@/lib/templateParser";


export async function POST(req) {
  try {
    const { templateType, userCategory } = req.body;
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

    const template = await EmailTemplate.findOne({ type: templateType });
    if (!template) return res.status(404).json({ error: "Template not found" });

    let users = [];
    switch (userCategory) {
      case "free":
        users = await User.find({ isAdminFeePaid: false });
        break;
      case "adminFeePaid":
        users = await User.find({
          isAdminFeePaid: true,
          isMembershipPaid: false,
        });
        break;
      case "membershipPaid":
        users = await User.find({ isMembershipPaid: true });
        break;
      default:
        return res.status(400).json({ error: "Invalid category" });
    }

    if (users.length === 0)
      return res
        .status(404)
        .json({ error: "No users found for this category" });


        for (const user of users) {
      const html = parseTemplate(template.body, {
        FirstName: user.firstName,
        MemberFullName: `${user.firstName} ${user.lastName}`,
        MemberEmail: user.email,
        MemberUsername: user.username,
        SponsorUser: user.referredBy || "", //yahn abi usernam store ho rha h ise object me convert kr k uska name fetch krna h
        LoginLink: `${process.env.NEXTAUTH_URL}/login`,
        AdminFeeLink: `${process.env.NEXTAUTH_URL}/payment/?uid=${user._id}`,
        SponsorPaymentLink: `${process.env.NEXTAUTH_URL}/user/pay-to-sponser`
      })

      await sendEmail(user.email, template.subject, html);
    }

    return NextResponse.json({ success: true, message: `Emails sent to ${users.length} users.` });
      

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

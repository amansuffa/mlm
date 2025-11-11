import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { EmailTemplate } from "@/models/EmailTemplate";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { sendEmail } from "@/lib/sendEmail";
import { parseTemplate } from "@/lib/parseTemplate";
import crypto from "crypto";

function generateVerificationToken() {
  return crypto.randomBytes(20).toString("hex");
}

export async function POST(req) {
  try {
    const { userCategory, templateId } = await req.json();
    await connectDB();
    console.log("userCategory", userCategory);
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

     const template = await EmailTemplate.findById(templateId);
    
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    let users = [];
    switch (userCategory) {
      case "unverified":
        users = await User.find({ isVerified: false });
        for (let user of users) {
          user.verificationToken = generateVerificationToken();
          await user.save();
        }
        break;
      case "free":
        users = await User.find({ adminFeePaid: false });
        break;
      case "admin_fee_paid":
        users = await User.find({
          adminFeePaid: true,
          membershipFeePaid: false,
        });
        break;
      case "membership_paid":
        users = await User.find({ membershipFeePaid: true });
        break;
      case "fully_active":
        users = await User.find({
          membershipFeePaid: true,
          adminFeePaid: true,
        });
        break;
      case "all":
        users = await User.find({ role: { $ne: "admin" } });
        break;
      default:
        return NextResponse.json(
          {
            error:
              "Invalid category. Available categories: unverified, free, admin_fee_paid, membership_paid",
          },
          { status: 400 }
        );
    }

    if (users.length === 0)
      return NextResponse.json(
        { error: "No users found for this category" },
        { status: 404 }
      );

    for (const user of users) {
      const verifyUrl = user.verificationToken
        ? `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${user.verificationToken}`
        : "";

      const html = parseTemplate(template.body, {
        MemberFirstName: user.name, //yehn first name add krna h abi name kiya h
        MemberFullName: `${user.firstName} ${user.lastName}`,
        MemberEmail: user.email,
        MemberUsername: user.username,
        SponsorName: user.referredBy || "", //yahn abi usernam store ho rha h ise object me convert kr k uska name fetch krna h
        LoginLink: `${process.env.NEXTAUTH_URL}/login`,
        AdminFeeLink: `${process.env.NEXTAUTH_URL}/payment/?uid=${user._id}`,
        SponsorPaymentLink: `${process.env.NEXTAUTH_URL}/user/pay-to-sponser`,
        ConfirmEmailLink: verifyUrl,
      });

      await sendEmail(user.email, template.subject, html);
    }

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${users.length} users.`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";
import { EmailTemplate } from "@/models/EmailTemplate";
import { parseTemplate } from "@/lib/parseTemplate";
import { buildTemplateData } from "@/utils/emailTemplateData";

export async function POST(req) {
  await connectDB();
 

  try {
    const body = await req.json();
    const {
      sender,
      amount,
      type,
      method,
      note,
      image,
      name,
      email,
      username,
      transactionId,
      wiseAccountEmail,
    } = body;

    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
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
      name,
      email,
      username,
      transactionId,
      wiseAccountEmail,
    });

    // (Optional) Notification can be created here later
    // await Notification.create({
    //   user: receiver,
    //   message: `New payment of $${amount} received from ${session.user.name}`,
    //   link: `/transactions`,
    // });

      // Find email receiver
          const user = await User.findOne({ _id: sender });
          const sponsor = await User.findOne({ username: user.referredBy });
          const admin = adminUser;
          // Find email templates
        
          const adminTemplate = await EmailTemplate.findOne({
            type: "admin_fee_paid_manual",
          });
      
    
          const templateData = buildTemplateData(user,{
            MemberFirstName: user.firstName || user.name?.split(' ')[0] || 'Member',
            MemberName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
            MemberEmail: user.email,
            MemberUsername: user.username,
            SponsorName: sponsor?.name || "N/A",
          });
    
    
          // Send email to admin
          if (adminTemplate && admin) {
            try {
              const adminHtml = parseTemplate(adminTemplate.body, templateData);
              await sendEmail(admin.email, adminTemplate.subject, adminHtml);
            } catch (error) {
              console.error("❌ Failed to send admin email:", error);
            }
          }

    return NextResponse.json({ success: true, data: newTx });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

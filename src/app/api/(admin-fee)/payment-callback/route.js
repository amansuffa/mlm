import { updatePaymentStatus } from "@/utils/updatePaymentStatus";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";
import { EmailTemplate } from "@/models/EmailTemplate";
import { parseTemplate } from "@/lib/parseTemplate";

export async function POST(request) {
  try {
    await connectDB();
    const paymentData = await request.json();

    console.log("PAYMENT RECEIVED:", paymentData);

    if (paymentData.payment_status === "finished") {
      console.log("Payment successful for order:", paymentData.order_id);

      await updatePaymentStatus(paymentData.order_id, "paid");

      // Find email receiver
      const user = await User.findOne({ _id: paymentData.user_id });
      const sponsor = await User.findOne({ username: user.referredBy });
      const admin = await User.findOne({ role: "admin" });
      // Find email templates
      const userTemplate = await EmailTemplate.findOne({
        type: "user_admin_fee_paid",
      });
      const sponsorTemplate = await EmailTemplate.findOne({
        type: "sponsor_referral_admin_fee_paid",
      });
      const adminTemplate = await EmailTemplate.findOne({
        type: "admin_fee_paid_crypto",
      });

      const templateData = {
        MemberFirstName: user.firstName || user.name,
        MemberName: user.name,
        MemberEmail: user.email,
        MemberUsername: user.username,
        SponsorName: sponsor?.name || "N/A",
        SponsorFirstName: sponsor?.firstName || "N/A",
        LoginLink: `${process.env.NEXTAUTH_URL}/login`,
        SponsorPaymentLink: `${process.env.NEXTAUTH_URL}/user/pay-to-sponser`,
      };

      // Send email to user
      if (userTemplate) {
        const userHtml = parseTemplate(userTemplate.body, templateData);
        await sendEmail(user.email, userTemplate.subject, userHtml);
      }

      // Send email to sponsor
      if (sponsorTemplate && sponsor) {
        const sponsorHtml = parseTemplate(sponsorTemplate.body, templateData);
        await sendEmail(sponsor.email, sponsorTemplate.subject, sponsorHtml);
      }

      // Send email to admin
      if (adminTemplate && admin) {
        const adminHtml = parseTemplate(adminTemplate.body, templateData);
        await sendEmail(admin.email, adminTemplate.subject, adminHtml);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("IPN Error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

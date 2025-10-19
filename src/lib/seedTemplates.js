import { EmailTemplate } from "@/models/EmailTemplate";

export async function seedEmailTemplates() {
  const count = await EmailTemplate.countDocuments();
  if (count > 0) {
    console.log("⚠️ Email templates already exist, skipping seed.");
    return;
  }

  console.log("🚀 Seeding default email templates...");

  const defaults = [
    // ====================== 🧑‍💼 ADMIN EMAILS ======================
    {
      name: "Admin - New Member Signup",
      type: "admin_new_signup",
      category: "Admin",
      subject: "New Member Signup Alert",
      body: `
        Hello Admin,<br><br>
        A new member has just signed up on PASH.CLUB.<br><br>
        <strong>Details:</strong><br>
        Name: {{MemberFullName}}<br>
        Email: {{MemberEmail}}<br>
        Username: {{MemberUsername}}<br>
        Sponsor Name: {{SponsorName}}<br><br>
        Regards,<br>Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "Admin - Admin Fee Paid (Crypto link)",
      type: "admin_fee_paid_crypto",
      category: "Admin",
      subject: "Admin Fee Payment Received – {{MemberFullName}}",
      body: `
        Hello Admin,<br><br>
        The following member has successfully paid the one-time $50 admin fee.<br><br>
        Name: {{MemberFullName}}<br>
        Email: {{MemberEmail}}<br>
        Username: {{MemberUsername}}<br>
        Sponsor Name: {{SponsorName}}<br><br>
        Regards,<br>PASH.CLUB System
      `,
      isDefault: true,
    },
    {
      name: "Admin - Member Activated",
      type: "admin_member_activated",
      category: "Admin",
      subject: "Member Activated – {{MemberFullName}}",
      body: `
        Hello Admin,<br><br>
        The following member’s payment has been confirmed and is now fully activated:<br><br>
        Name: {{MemberFullName}}<br>
        Username: {{MemberUsername}}<br>
        Activation Date: {{ActivationDate}}<br><br>
        Regards,<br>PASH.CLUB System
      `,
      isDefault: true,
    },

    // ====================== 👤 USER EMAILS ======================
    {
      name: "User - Welcome (Before Payment)",
      type: "user_welcome",
      category: "User",
      subject: "Welcome to PASH.CLUB – Let’s Get You Set Up!",
      body: `
        Hi {{FirstName}},<br><br>
        Welcome to PASH.CLUB 🎉<br>
        Next steps: Pay Admin Fee and Membership Fee.<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "User - Membership Activated",
      type: "user_membership_activated",
      category: "User",
      subject: "You’re Now Fully Activated – Welcome to the Club!",
      body: `
        Hi {{FirstName}},<br><br>
        Congrats! You’re now fully activated.<br><br>
        Login here: <a href="{{LoginLink}}">Dashboard</a><br><br>
        Team PASH.CLUB
      `,
      isDefault: true,
    },

    // ====================== 🤝 SPONSOR EMAILS ======================
    {
      name: "Sponsor - New Referral Signed Up",
      type: "sponsor_referral",
      category: "Sponsor",
      subject: "🎉 You Got a New Referral – They Just Signed Up!",
      body: `
        Hi {{SponsorName}},<br><br>
        New referral: {{NewMemberName}}<br>
        Username: {{NewMemberUsername}}<br><br>
        Team PASH.CLUB
      `,
      isDefault: true,
    },
    {
      name: "Sponsor - Confirm $500 Payment",
      type: "sponsor_confirm_payment",
      category: "Sponsor",
      subject: "⚡ Confirm Payment – $500 Received… 💸",
      body: `
        Hi {{SponsorName}},<br><br>
        You received a $500 payment from {{NewMemberName}}.<br>
        Please confirm it in your dashboard.<br><br>
        Team PASH.CLUB
      `,
      isDefault: true,
    },

    // ====================== 🧬 SPONSOR OF SPONSOR ======================
    {
      name: "Sponsor of Sponsor - Downline Activity",
      type: "sponsor_of_sponsor_activity",
      category: "Sponsor of Sponsor",
      subject: "New Downline Activity Notification",
      body: `
        Hi {{SponsorName}},<br><br>
        A downline under your referral {{DirectSponsor}} just got a new signup: {{NewMemberName}}.<br><br>
        Team PASH.CLUB
      `,
      isDefault: true,
    },

    // ====================== 💌 PROMOTION EMAILS ======================
    {
      name: "Promotion - Free Member Offer",
      type: "promotion_free_user_offer",
      category: "Promotion",
      subject: "🔥 Limited-Time Offer for Free Members!",
      body: `
        Hi {{FirstName}},<br><br>
        Activate your membership today and unlock bonuses!<br><br>
        Team PASH.CLUB
      `,
      isDefault: true,
    },

    // ====================== 🧠 SYSTEM EMAILS ======================
    {
      name: "System - Password Reset",
      type: "system_password_reset",
      category: "System",
      subject: "Reset Your PASH.CLUB Password",
      body: `
        Hi {{FirstName}},<br><br>
        Click below to reset your password:<br>
        <a href="{{ResetLink}}">Reset Password</a><br><br>
        Team PASH.CLUB
      `,
      isDefault: true,
    },

    // ====================== 📩 LEADS EMAILS ======================
    {
      name: "Lead - New Prospect Registered",
      type: "lead_new_registration",
      category: "Leads",
      subject: "🎯 New Prospect on PASH.CLUB",
      body: `
        Hello {{AdminName}},<br><br>
        A new prospect just signed up: {{LeadName}}<br>
        Email: {{LeadEmail}}<br><br>
        Follow up to convert them into a member.<br><br>
        Team PASH.CLUB
      `,
      isDefault: true,
    },

    // ====================== 🗂 OTHER ======================
    {
      name: "General Info",
      type: "general_info",
      category: "Other",
      subject: "Important Update from PASH.CLUB",
      body: `
        Hello {{FirstName}},<br><br>
        This is a general informational email.<br><br>
        Regards,<br>Team PASH.CLUB
      `,
      isDefault: true,
    },
  ];

  try {
    // Insert one by one to avoid unique constraint issues
    for (const template of defaults) {
      try {
        await EmailTemplate.create(template);
        console.log(`✅ Created template: ${template.name}`);
      } catch (templateError) {
        console.log(`⚠️ Skipped template ${template.name}:`, templateError.message);
      }
    }
    console.log("✅ Email template seeding completed!");
  } catch (err) {
    console.error("❌ Error seeding email templates:", err);
  }
}

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
      subject: "New Member Signup Alert",
      body: `
        Hello Admin,<br><br>
        A new member has just signed up on PASH.CLUB.<br><br>
        <strong>Details:</strong><br>
        Name: {{MemberFullName}}<br>
        Email: {{MemberEmail}}<br>
        Username: {{MemberUsername}}<br>
        Sponsor Name: {{SponsorName}}<br><br>
        The member has created an account but has not yet paid the admin or membership fee.<br><br>
        Regards,<br>Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "Admin - Admin Fee Paid (Crypto link)",
      type: "admin_fee_paid_crypto",
      subject: "Admin Fee Payment Received – {{MemberFullName}}",
      body: `
        Hello Admin,<br><br>
        The following member has successfully paid the one-time $50 admin fee.<br><br>
        <strong>Details:</strong><br>
        Name: {{MemberFullName}}<br>
        Email: {{MemberEmail}}<br>
        Username: {{MemberUsername}}<br>
        Sponsor Name: {{SponsorName}}<br><br>
        The member can now proceed to pay their sponsor’s membership fee.<br><br>
        Regards,<br>PASH.CLUB System
      `,
      isDefault: true,
    },
    {
      name: "Admin - Admin Fee Paid (Manual - needs confirmation)",
      type: "admin_fee_paid_manual",
      subject: "Admin Fee Payment Received – {{MemberFullName}}",
      body: `
        Hello Admin,<br><br>
        The following member has successfully paid the one-time $50 admin fee manually.<br><br>
        <strong>Details:</strong><br>
        Name: {{MemberFullName}}<br>
        Email: {{MemberEmail}}<br>
        Username: {{MemberUsername}}<br>
        Sponsor Name: {{SponsorName}}<br><br>
        The member is awaiting confirmation, please confirm the admin fee payment.<br><br>
        Once user is confirmed, they will proceed to step 2 – paying the membership fee.<br><br>
        Regards,<br>PASH.CLUB System
      `,
      isDefault: true,
    },
    {
      name: "Admin - Membership Payment Sent",
      type: "admin_membership_sent",
      subject: "Membership Payment Sent – {{MemberFullName}}",
      body: `
        Hello Admin,<br><br>
        The following member has confirmed sending their membership payment to their sponsor (or sponsor’s sponsor).<br><br>
        <strong>Details:</strong><br>
        Name: {{MemberFullName}}<br>
        Username: {{MemberUsername}}<br>
        Amount: $500<br>
        Payment Date: {{PaymentDate}}<br>
        Paid To: {{PaidTo}}<br>
        Original Sponsor: {{OriginalSponsor}}<br><br>
        Waiting for sponsor confirmation to activate membership.<br><br>
        Regards,<br>PASH.CLUB System
      `,
      isDefault: true,
    },
    {
      name: "Admin - Member Activated",
      type: "admin_member_activated",
      subject: "Member Activated – {{MemberFullName}}",
      body: `
        Hello Admin,<br><br>
        The following member’s payment has been confirmed by their sponsor, and their account is now fully activated.<br><br>
        <strong>Details:</strong><br>
        Name: {{MemberFullName}}<br>
        Username: {{MemberUsername}}<br>
        Activated By: {{ActivatedBy}}<br>
        Paid To: {{PaidTo}}<br>
        Original Sponsor: {{OriginalSponsor}}<br>
        Activation Date: {{ActivationDate}}<br><br>
        The member now has full access to PASH.CLUB benefits and affiliate system.<br><br>
        Regards,<br>PASH.CLUB System
      `,
      isDefault: true,
    },

    // ====================== 👤 NEW USER EMAILS ======================
    {
      name: "User - Email Confirmation",
      type: "user_email_confirmation",
      subject: "Confirm Your Email to Activate Your Free PASH.CLUB Account 🚀",
      body: `
        Hi {{FirstName}},<br><br>
        Welcome to PASH.CLUB – we’re excited to have you on board! 🎉<br><br>
        Before we can activate your free member account, we just need to confirm your email address.<br><br>
        👉 Please click the link below to confirm your email now:<br>
        <a href="{{ConfirmationLink}}">Confirm My Email Address</a><br><br>
        Once confirmed, you’ll get:<br>
        ✅ A Welcome Email<br>
        ✅ Step-by-step guide on how to get started<br><br>
        If you didn’t sign up for PASH.CLUB, you can safely ignore this email.<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "User - Welcome (Before Payment)",
      type: "user_welcome",
      subject: "Welcome to PASH.CLUB – Let’s Get You Set Up!",
      body: `
        Hi {{FirstName}},<br><br>
        Welcome to PASH.CLUB – you just made a powerful move! 🎉<br><br>
        Your account credentials:<br>
        Name: {{MemberFullName}}<br>
        Email: {{MemberEmail}}<br>
        Username: {{MemberUsername}}<br>
        Sponsor Name: {{SponsorName}}<br><br>
        You’ve successfully created your free account, and now there are 2 quick steps left to activate your membership:<br>
        ✅ Pay the one-time $50 Admin Fee – <a href="{{AdminFeeLink}}">Pay Admin Fee</a><br>
        ✅ Pay the one-time $500 Membership Fee to your sponsor directly.<br><br>
        👉 Click here and complete your setup now » <a href="{{AdminFeeLink}}">{{AdminFeeLink}}</a><br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "User - After Paying Admin Fee",
      type: "user_admin_fee_paid",
      subject: "Admin Fee Received – Step 1 Done!",
      body: `
        Hi {{FirstName}},<br><br>
        Thanks for paying the $50 one-time admin fee – Step 1 is complete ✅<br><br>
        Now it’s time for the final step:<br>
        👉 Pay the membership fee directly to your sponsor to unlock your membership and activate your income stream. <a href="{{SponsorPaymentLink}}">Pay Your Sponsor</a><br><br>
        This will give you:<br>
        ✅ Full access to your dashboard<br>
        ✅ Ability to receive unlimited $500 instant payments paid directly to you<br>
        ✅ Lifetime access to PASH.CLUB marketing resources.<br><br>
        Please download your invoice below.<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "User - Membership Fee Sent (Pending Confirmation)",
      type: "user_membership_pending",
      subject: "💳 Membership Fee Sent – Awaiting Confirmation",
      body: `
        Hi {{FirstName}},<br><br>
        🔥 We’ve been notified that you’ve paid your $500 membership fee to your sponsor (or their sponsor). Great job! 🙌<br><br>
        Now, your membership is in pending confirmation status until your sponsor (or their sponsor) verifies and approves your payment.<br><br>
        👉 Once confirmed, your account will be activated, and you’ll be ready to:<br>
        ✅ Access your dashboard<br>
        ✅ Set up your payment method<br>
        ✅ Share your referral link<br>
        ✅ Start promoting & receive $500 payments instantly<br><br>
        Please allow some time for your sponsor to review and confirm. We’ll notify you the moment your membership is activated.<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "User - Membership Activated",
      type: "user_membership_activated",
      subject: "You’re Now Fully Activated – Welcome to the Club!",
      body: `
        Hi {{FirstName}},<br><br>
        🔥 Congrats – You’re now a fully activated member of PASH.CLUB!<br><br>
        You’ve unlocked the system, and you now have the power to earn unlimited $500 payments directly to YOU.<br><br>
        Here’s what to do next:<br>
        ✅ Access your dashboard: <a href="{{LoginLink}}">Login</a><br>
        ✅ Set up your payment method<br>
        ✅ Share your referral link<br>
        ✅ Start promoting & receive $500 payments instantly<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "User - 5 Hours After Activation (Action Plan)",
      type: "user_action_plan_5hrs",
      subject: "Your First 3 Steps to Start Earning with PASH.CLUB",
      body: `
        Hi {{FirstName}},<br><br>
        Now that you’re fully activated, here’s how to get your first $500 payment fast:<br><br>
        🎯 Step 1: Set up your payment details inside the dashboard<br>
        🎯 Step 2: Grab your referral link<br>
        🎯 Step 3: Check the dashboard training and marketing resources<br><br>
        🔗 Go to your dashboard and get started » <a href="{{LoginLink}}">{{LoginLink}}</a><br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "User - First Sale (Passed Up to Sponsor)",
      type: "user_first_sale_passed_up",
      subject: "Your First Sale is In! Here’s What Happens Next… 💸",
      body: `
        Hi {{MemberFirstName}},<br><br>
        🎉 Congratulations! You just made your first sale with PASH.CLUB – that’s a huge milestone!<br><br>
        👤 New Member Name: {{NewMemberName}}<br>
        📩 Email: {{NewMemberEmail}}<br>
        👤 New Member Username: {{NewMemberUsername}}<br><br>
        As per our powerful 1-Up Compensation Plan, this first sale is automatically passed up to your sponsor.<br><br>
        ✅ Starting from your 2nd sale onward, every $500 payment goes directly to YOU – instantly<br>
        ✅ Your membership will NOT expire ever<br><br>
        👉 Keep promoting. The next sale you make is yours to keep.<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "User - Commission Earned (2nd+ Sale)",
      type: "user_commission_earned",
      subject: "💰 You Just Earned Another $500 – Keep It Coming!",
      body: `
        Congratulations {{MemberFirstName}}! 🎉<br><br>
        You just made $500 commission from your PASH.CLUB system. 💸<br><br>
        👤 New Member Name: {{NewMemberName}}<br>
        📩 Email: {{NewMemberEmail}}<br>
        👤 New Member Username: {{NewMemberUsername}}<br><br>
        This is where the magic begins. Each new member in your downline will pass up their 1st sale to you.<br><br>
        👉 Keep sharing your link<br>
        👉 Keep the momentum going<br>
        👉 Stack those $500 commissions like clockwork!<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },

    // ====================== 🤝 SPONSOR EMAILS ======================
    {
      name: "Sponsor - New Referral Signed Up",
      type: "sponsor_referral",
      subject: "🎉 You Got a New Referral – They Just Signed Up!",
      body: `
        Hi {{MemberFirstName}},<br><br>
        Great news! A new user just signed up through your referral link 🚀<br><br>
        👤 New Member Name: {{NewMemberName}}<br>
        📩 Email: {{NewMemberEmail}}<br>
        👤 New Member Username: {{NewMemberUsername}}<br><br>
        They’ve created an account and are now just 2 steps away from becoming a paid member.<br><br>
        Keep sharing your link and watch your network grow!<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "Sponsor - Referral Paid Admin Fee",
      type: "sponsor_referral_admin_fee",
      subject: "🛠️ Your Referral Just Paid the Admin Fee!",
      body: `
        Hi {{MemberFirstName}},<br><br>
        Your new referral just completed Step 1 by paying the $50 one-time admin fee ✅<br><br>
        👤 New Member Name: {{NewMemberName}}<br>
        📩 Email: {{NewMemberEmail}}<br>
        👤 New Member Username: {{NewMemberUsername}}<br><br>
        They are now just one step away from becoming a fully active member.<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "Sponsor - $500 Payment Received (Action Required)",
      type: "sponsor_confirm_payment",
      subject: "⚡ Confirm Payment – $500 Received… 💸",
      body: `
        Hi {{MemberFirstName}},<br><br>
        A member in your downline has just sent you their $500 membership fee. 🎉<br><br>
        👤 New Member Name: {{NewMemberName}}<br>
        📩 Email: {{NewMemberEmail}}<br>
        👤 New Member Username: {{NewMemberUsername}}<br><br>
        👉 Please log in to your back office and confirm once you have received the payment:<br>
        <a href="{{LoginLink}}">Confirm Payment</a><br><br>
        ⚠️ Note: Their membership will remain pending until you approve the payment. Once confirmed, their account will be activated immediately.<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
    {
      name: "Sponsor - Member Activated (You activated downline)",
      type: "sponsor_member_activated",
      subject: "🎊 You’ve Successfully Activated Your New Downline Member",
      body: `
        Congratulations {{MemberFirstName}}! 🎉<br><br>
        You have successfully confirmed the $500 payment from your new downline member and their PASH.CLUB membership is now active! ✅<br><br>
        👤 New downline Member Name: {{NewMemberName}}<br>
        📩 Email: {{NewMemberEmail}}<br>
        👤 New downline Member Username: {{NewMemberUsername}}<br><br>
        This means:<br>
        ✅ They’re now a fully active member under your team<br>
        ✅ They can start promoting and earning unlimited $500 payments<br><br>
        Team PASH.CLUB<br>www.PASH.club
      `,
      isDefault: true,
    },
  ];

  // for (const tpl of defaults) {
  //   try {
  //     const exists = await EmailTemplate.findOne({ type: tpl.type });
  //     if (!exists) {
  //       await EmailTemplate.create(tpl);
  //       console.log(`✅ Seeded: ${tpl.name} (${tpl.type})`);
  //     } else {
  //       console.log(`ℹ️ Already exists: ${tpl.name} (${tpl.type})`);
  //     }
  //   } catch (err) {
  //     console.error(`❌ Error seeding ${tpl.type}:`, err);
  //   }
  // }

  try {
    await EmailTemplate.insertMany(defaults);
    console.log("✅ Default email templates seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding email templates:", err);
  }
}

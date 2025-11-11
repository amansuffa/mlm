import { EmailTemplate } from "@/models/EmailTemplate";

export async function seedEmailTemplates() {
  const count = await EmailTemplate.countDocuments();
  if (count > 0) {
    console.log("⚠️ Email templates already exist, skipping seed.");
    return;
  }

  console.log("🚀 Seeding default email templates...");

  const disclaimer = `
 
  <hr>
  <small>
  DISCLAIMER: This e-mail is NOT spam. You registered to receive this. Our system is tied to your email, 
  so if you unsubscribe, we can't deliver your training, tips, and updates anymore — even those you paid for. 
  If you ever want to stop receiving email from us, simply click the unsubscribe link below. 
  <br><br>
  Important: To ensure our emails are delivered to your inbox, please add <strong>info@pash.club</strong> 
  to your contacts list.
  </small>
  `;

  const defaults = [
    // ====================== 🧑‍💼 ADMIN EMAILS ======================
    {
      name: "Admin - New Member Signup",
      type: "admin_new_signup",
      category: "Admin",
      subject: "New Member Signup Alert",
      body: `
  Hello Admin,<br><br>
The following member has successfully paid the one-time $50 admin fee.<br><br>
<strong>Details:</strong><br>
• Name: {{MemberFullName}}<br>
• Email: {{MemberEmail}}<br>
• Username: {{MemberUsername}}<br>
• Sponsor Name: {{SponsorName}}<br><br>
The member can now proceed to pay their sponsor’s membership fee.<br><br>
Regards,<br>
PASH.CLUB System<br><br>
${disclaimer}


      `,
      isDefault: true,
    },
    {
      name: "Admin - Admin Fee Paid (Crypto)",
      type: "admin_fee_paid_crypto",
      category: "Admin",
      subject: "Admin Fee Payment Received – {{MemberFullName}}",
      body: `
    Hello Admin,<br><br>
The following member has successfully paid the one-time $50 admin fee.<br><br>
<strong>Details:</strong><br>
• Name: {{MemberFullName}}<br>
• Email: {{MemberEmail}}<br>
• Username: {{MemberUsername}}<br>
• Sponsor Name: {{SponsorName}}<br><br>
The member can now proceed to pay their sponsor’s membership fee.<br><br>
Regards,<br>
PASH.CLUB System<br><br>
${disclaimer}

      `,
      isDefault: true,
    },
    {
      name: `Admin - Admin Fee Paid (Manual)`,
      type: "admin_fee_paid_manual",
      category: "Admin",
      subject: `Admin Fee Payment Received – {{MemberFullName}}`,
      body: `Hello Admin,<br><br>
The following member has successfully paid the one-time $50 admin fee manually.<br><br>
<strong>Details:</strong><br>
• Name: {{MemberFullName}}<br>
• Email: {{MemberEmail}}<br>
• Username: {{MemberUsername}}<br>
• Sponsor Name: {{SponsorName}}<br><br>
The member is awaiting confirmation, please confirm the admin fee payment.<br>
Once the user is confirmed, they will proceed to step 2 – paying the membership fee.<br><br>
Regards,<br>
PASH.CLUB System<br><br>
${disclaimer}

`,
      isDefault: true,
    },
    {
      name: "Admin - Membership Payment Sent",
      type: "admin_membership_payment_sent",
      category: "Admin",
      subject: "Membership Payment Sent – {{MemberFullName}}",
      body: `
     Hello Admin,<br><br>
The following member has confirmed sending their membership payment to their sponsor (or sponsor’s sponsor).<br><br>
<strong>Details:</strong><br>
• Name: {{MemberFullName}}<br>
• Username: {{MemberUsername}}<br>
• Amount: $500<br>
• Payment Date: {{PaymentDate}}<br>
• Paid To: {{PaidTo}}<br>
• Original Sponsor: {{SponsorName}}<br><br>
Waiting for sponsor confirmation to activate membership.<br><br>
Regards,<br>
PASH.CLUB System<br><br>
${disclaimer}


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
The following member’s payment has been confirmed by their sponsor, and their account is now fully activated.<br><br>
<strong>Details:</strong><br>
• Name: {{MemberFullName}}<br>
• Username: {{MemberUsername}}<br>
• Activated By: {{ActivatedBy}}<br>
• Paid To: {{PaidTo}}<br>
• Original Sponsor: {{SponsorName}}<br>
• Activation Date: {{ActivationDate}}<br><br>
The member now has full access to PASH.CLUB benefits and affiliate system.<br><br>
Regards,<br>
PASH.CLUB System<br><br>
${disclaimer}`,
      isDefault: true,
    },

    // ====================== 👤 USER EMAILS ======================
    {
      name: "User - Confirm Email",
      type: "user_confirm_email",
      category: "User",
      subject: "Confirm Your Email to Activate Your Free PASH.CLUB Account 🚀",
      body: `
 Hi {{FirstName}},<br><br>
Welcome to PASH.CLUB – we’re excited to have you on board! 🎉<br><br>
Before we can activate your free member account, we just need to confirm your email address. This ensures you’ll receive important updates, training, and access details without missing anything.<br><br>
👉 Please click the link below to confirm your email now:<br>
<a href="{{ConfirmEmailLink}}" style="color:#007bff;text-decoration:none;">Confirm My Email Address</a><br><br>
Once confirmed, you’ll get:<br>
✅ A Welcome Email<br>
✅ Step-by-Step guide on how to get started<br><br>
If you didn’t sign up for PASH.CLUB, you can safely ignore this email.<br><br>
We’re looking forward to helping you on your journey!<br><br>
See you on the inside!<br>
Team PASH.CLUB<br>
www.PASH.club<br><br>
${disclaimer}

      `,
      isDefault: true,
    },
    {
      name: "User - Welcome (Before Payment)",
      type: "user_welcome",
      category: "User",
      subject: "Welcome to PASH.CLUB – Let’s Get You Set Up!",
      body: `
  Hi {{FirstName}},<br><br>
Welcome to PASH.CLUB – you just made a powerful move!<br><br>
<strong>Your account credentials:</strong><br>
• Name: {{MemberFullName}}<br>
• Email: {{MemberEmail}}<br>
• Username: {{MemberUsername}}<br>
• Sponsor Name: {{SponsorName}}<br><br>
You’ve successfully created your free account, and now there are 2 quick steps left to activate your membership:<br><br>
✅ Pay the one-time $50 Admin Fee – <a href="{{AdminFeeLink}}">Click here</a><br>
✅ Pay the one-time $500 Membership Fee directly to your sponsor.<br><br>
👉 <a href="{{AdminFeeLink}}">Complete your setup now »</a><br><br>
See you on the inside!<br>
Team PASH.CLUB<br>
www.PASH.club<br><br>
${disclaimer}

      `,
      isDefault: true,
    },
    {
      name: "User - Admin Fee Paid",
      type: "user_admin_fee_paid",
      category: "User",
      subject: "Admin Fee Received – Step 1 Done!",
      body: `
       Hi {{FirstName}},<br><br>
Thanks for paying the $50 one-time admin fee – Step 1 is complete ✅<br><br>
Now it’s time for the final step:<br>
Login here: <a href="{{LoginLink}}">Go to Dashboard »</a><br><br>
👉 Pay the membership fee directly to your sponsor to unlock your membership and activate your income stream.<br>
<a href="{{SponsorPaymentLink}}">Pay Your Sponsor Now »</a><br><br>
This will give you:<br>
✅ Full access to your dashboard<br>
✅ Ability to receive unlimited $500 instant payments<br>
✅ Lifetime access to PASH.CLUB marketing resources<br><br>
Please download your invoice below.<br><br>
Let’s get you earning ASAP!<br>
Team PASH.CLUB<br>
www.PASH.club<br><br>
${disclaimer}

      `,
      isDefault: true,
    },
    {
      name: "User - Membership Fee Paid",
      type: "user_membership_fee_paid",
      category: "User",
      subject: "💳 Membership Fee Sent – Awaiting Confirmation",
      body: `
     Hi {{FirstName}},<br><br>
🔥 We’ve been notified that you’ve paid your $500 membership fee to your sponsor (or their sponsor). Great job! 🙌<br><br>
Now your membership is in pending confirmation status until your sponsor verifies your payment.<br><br>
Once confirmed, your account will be activated and you’ll be ready to:<br>
✅ Access your dashboard<br>
✅ Set up your payment method<br>
✅ Share your referral link<br>
✅ Start promoting & receive $500 payments instantly<br><br>
Please allow some time for confirmation. We’ll notify you as soon as your account is live.<br><br>
Your journey to freedom starts now.<br>
To your success,<br>
Team PASH.CLUB<br>
www.PASH.club<br><br>
${disclaimer}

      `,
      isDefault: true,
    },
    {
      name: "User - Membership Activated",
      type: "user_membership_activated",
      category: "User",
      subject: "You’re Now Fully Activated – Welcome to the Club!",
      body: `Hi {{FirstName}},<br><br>
🔥 Congrats – You’re now a fully activated member of PASH.CLUB!<br><br>
You’ve unlocked the system, and you now have the power to earn unlimited $500 payments directly to YOU.<br><br>
Here’s what to do next:<br>
✅ Access your dashboard: <a href="{{LoginLink}}">Log in now »</a><br>
✅ Set up your payment method<br>
✅ Share your referral link<br>
✅ Start promoting & receive $500 instantly<br><br>
Your journey to freedom starts right now.<br>
We’re here to support you every step of the way!<br><br>
To your success,<br>
Team PASH.CLUB<br>
www.PASH.club<br><br>
${disclaimer}`,
      isDefault: true,
    },
    {
      name: "User - 5 Hours After Activation – Action Plan",
      type: "user_action_plan",
      category: "User",
      subject: "Your First 3 Steps to Start Earning with PASH.CLUB",
      body: `
    Hi {{FirstName}},<br><br>
Now that you’re fully activated, here’s how to get your first $500 payment fast:<br><br>
🎯 Step 1: Set up your payment details inside the dashboard<br>
🎯 Step 2: Grab your referral link<br>
🎯 Step 3: Check the dashboard training and marketing resources<br><br>
🔗 <a href="{{LoginLink}}">Go to your dashboard and get started »</a><br><br>
Remember – your 1st sale is passed up to your sponsor, but every sale after that goes directly to you!<br><br>
It’s time to grow your income. You’ve got this 💪<br>
Team PASH.CLUB<br>
www.PASH.club<br><br>
${disclaimer}
      `,
      isDefault: true,
    },
    {
      name: "User - First Sale Passed Up to Sponsor",
      type: "user_first_sale_passed_up",
      category: "User",
      subject: "Your First Sale is In! Here’s What Happens Next… 💸",
      body: `
    Hi {{FirstName}},<br><br>
    🎉 Congratulations! You just made your first sale with PASH.CLUB – that’s a huge milestone!<br><br>
    👤 New Member Name: {{MemberName}}<br>
    📩 Email: {{MemberEmail}}<br>
    👤 Username: {{MemberUsername}}<br><br>
    As per our powerful 1-Up Compensation Plan, this first sale is automatically passed up to your sponsor.<br><br>
    But here’s the exciting part:<br>
    ✅ Starting from your 2nd sale onward, every $500 payment goes directly to YOU<br>
    ✅ Your membership will NEVER expire<br><br>
    👉 Keep promoting. The next sale you make is yours to keep.<br><br>
    🔗 <a href="{{LoginLink}}">Log in and track your sales »</a><br><br>
    Stay focused. The momentum is real.<br>
    Team PASH.CLUB<br>
    www.PASH.club<br><br>
    ${disclaimer}
  `,
      isDefault: true,
    },
    {
      name: "User - $500 Commission Earned",
      type: "user_new_sale_earned",
      category: "User",
      subject: "💰 You Just Earned Another $500 – Keep It Coming!",
      body: `
    Congratulations {{FirstName}}! 🎉<br><br>
    You just made a $500 commission from your PASH.CLUB system. 💸<br><br>
    👤 New Member Name: {{MemberName}}<br>
    📩 Email: {{MemberEmail}}<br>
    👤 Username: {{MemberUsername}}<br><br>
    🔥 This is where the magic begins — each new member in your downline will pass up their 1st sale to you.<br>
    And the best part? There’s no limit to how many times this can happen.<br><br>
    👉 Keep sharing your link<br>
    👉 Keep the momentum going<br>
    👉 Stack those $500 commissions like clockwork!<br><br>
    Your success is just getting started 🚀<br>
    To Your Continued Growth,<br>
    Team PASH.CLUB<br>
    www.PASH.club<br><br>
    ${disclaimer}
  `,
      isDefault: true,
    },
 
    // ====================== 🤝 SPONSOR EMAILS ======================
    {
      name: "Sponsor - New Referral Signed Up",
      type: "sponsor_new_referral",
      category: "Sponsor",
      subject: "🎉 You Got a New Referral – They Just Signed Up!",
      body: `
    Hi {{FirstName}},<br><br>
    Good news – your team is working, and the system is rewarding you! 🎉<br><br>
    🔥 A member in your downline just made their first $500 qualifying sale, and guess what?<br>
    👉 That sale has been passed up to <strong>YOU</strong>, as per the 1-Up Compensation Plan!<br><br>
    💸 You just earned $500 directly<br>
    👥 Downline Member Name: {{SponsorName}}<br>
    📩 Downline Member Email: {{SponsorEmail}}<br>
    📥 Passed-Up Sale: 1st Sale<br>
    ✅ Paid: Directly to You<br><br>
    👤 New Passed-Up Member Name: {{MemberName}}<br>
    📩 Passed-Up Member Email: {{MemberEmail}}<br>
    👤 Passed-Up Member Username: {{MemberUsername}}<br><br>
    This is the power of leverage in action. Even if you didn’t refer them directly, the structure is working in your favor.<br><br>
    Keep building and helping your team succeed – because every time they win, you win too 💯<br><br>
    🔗 <a href="{{LoginLink}}">Log in to check your earnings</a><br><br>
    To your continued success,<br>
    Team PASH.CLUB<br>
    www.PASH.club<br><br>
    ${disclaimer}
      `,
      isDefault: true,
    },
    {
      name: "Sponsor - Referral Paid Admin Fee",
      type: "sponsor_referral_admin_fee_paid",
      category: "Sponsor",
      subject: "🛠️ Your Referral Just Paid the Admin Fee!",
      body: `
          Hi {{FirstName}},<br><br>
    Good news – your team is working, and the system is rewarding you! 🎉<br><br>
    🔥 A member in your downline just made their first $500 qualifying sale, and guess what?<br>
    👉 That sale has been passed up to <strong>YOU</strong>, as per the 1-Up Compensation Plan!<br><br>
    💸 You just earned $500 directly<br>
    👥 Downline Member Name: {{SponsorName}}<br>
    📩 Downline Member Email: {{SponsorEmail}}<br>
    📥 Passed-Up Sale: 1st Sale<br>
    ✅ Paid: Directly to You<br><br>
    👤 New Passed-Up Member Name: {{MemberName}}<br>
    📩 Passed-Up Member Email: {{MemberEmail}}<br>
    👤 Passed-Up Member Username: {{MemberUsername}}<br><br>
    This is the power of leverage in action. Even if you didn’t refer them directly, the structure is working in your favor.<br><br>
    Keep building and helping your team succeed – because every time they win, you win too 💯<br><br>
    🔗 <a href="{{LoginLink}}">Log in to check your earnings</a><br><br>
    To your continued success,<br>
    Team PASH.CLUB<br>
    www.PASH.club<br><br>
    ${disclaimer}
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
        You received $500 from {{NewMemberName}}.<br>
        Please confirm in your dashboard.<br><br>
        Team PASH.CLUB<br>www.PASH.club<br><br>
        ${disclaimer}
      `,
      isDefault: true,
    },
    {
      name: "Sponsor - Activated Downline",
      type: "sponsor_activated_downline",
      category: "Sponsor",
      subject: "🎊 You’ve Successfully Activated Your New Downline Member",
      body: `
        Congratulations {{SponsorName}}! 🎉<br><br>
        You’ve confirmed {{MemberName}}’s payment — they’re now active under your team!<br><br>
        Team PASH.CLUB<br>www.PASH.club<br><br>
        ${disclaimer}
      `,
      isDefault: true,
    },

    // ====================== 🧬 SPONSOR OF SPONSOR ======================

    {
      name: "Sponsor of Sponsor - Passed-Up Sale Notification",
      type: "sponsor_of_sponsor_passed_up_sale",
      category: "Sponsor of Sponsor",
      subject: "💰 A Downline Member Just Made a Sale – You Got Paid!",
      body: `
    Hi {{FirstName}},<br><br>
    Good news – your team is working, and the system is rewarding you! 🎉<br><br>
    🔥 A member in your downline just made their first $500 qualifying sale, and guess what?<br>
    👉 That sale has been passed up to YOU, as per the 1-Up Compensation Plan!<br><br>
    💸 You just earned $500 directly<br>
    👥 Downline Member Name: {{SponsorName}}<br>
    👥 Downline Member Email: {{SponsorEmail}}<br><br>
    📥 Passed-Up Sale: 1st Sale<br>
    ✅ Paid: Directly to You<br><br>
    👤 New Passed-Up Member Name: {{MemberName}}<br>
    📩 Passed-Up Member Email: {{MemberEmail}}<br>
    👤 Passed-Up Member Username: {{MemberUsername}}<br><br>
    This is the power of leverage in action. Even if you didn’t refer them directly, the structure is working in your favor.<br><br>
    Keep building and helping your team succeed – because every time they win, you win too 💯<br><br>
    🔗 Log in to check your earnings » <a href="{{LoginLink}}">{{LoginLink}}</a><br><br>
    To your continued success,<br>
    Team PASH.CLUB<br>www.PASH.club<br><br>
   
    ${disclaimer}
 
  `,
      isDefault: true,
    },
    {
      name: "Sponsor of Sponsor - Confirm Payment (Passed-Up Sale)",
      type: "sponsor_of_sponsor_confirm_payment",
      category: "Sponsor of Sponsor",
      subject: "⚡ Confirm Payment – $500 Received… 💸",
      body: `
    Hi {{FirstName}},<br><br>
    A passed-up member in your downline has just sent you their $500 membership fee. 🎉<br><br>
    👤 New Passed-Up Downline Member Name: {{MemberName}}<br>
    📩 Email: {{MemberEmail}}<br>
    👤 Username: {{MemberUsername}}<br>
    👤 Original Sponsor Name: {{SponsorName}}<br><br>
    👉 Please log in to your back office and confirm once you have received the payment:<br>
    🔗 <a href="{{LoginLink}}">{{LoginLink}}</a><br><br>
    ⚠️ Note: Their membership will remain pending until you approve the payment. Once confirmed, their account will be activated immediately.<br><br>
    Confirm now so your new team member can start building and earning!<br><br>
    👉 Stay focused. The momentum is real.<br><br>
    Let’s make your next $500 yours!<br>
    Team PASH.CLUB<br>www.PASH.club<br><br>
        ${disclaimer}
  `,
      isDefault: true,
    },
    {
      name: "Sponsor of Sponsor - Member Activated (Passed-Up Sale)",
      type: "sponsor_of_sponsor_member_activated",
      category: "Sponsor of Sponsor",
      subject:
        "🎊 You’ve Successfully Activated Your New Passed-Up Downline Member",
      body: `
    Congratulations {{FirstName}}! 🎉<br><br>
    You have successfully confirmed the $500 payment from your new passed-up downline member and their PASH.CLUB membership is now active! ✅<br><br>
    👤 New Passed-Up Downline Member Name: {{MemberName}}<br>
    📩 Email: {{MemberEmail}}<br>
    👤 Username: {{MemberUsername}}<br>
    👤 Original Sponsor Name: {{SponsorName}}<br><br>
    This means:<br>
    • They’re now a fully active member under your team<br>
    • They can start promoting and earning unlimited $500 payments<br>
    • You’ve just grown your downline stronger 💪<br><br>
    Fantastic job — keep up the momentum and watch your network grow!<br><br>
    Your success is just getting started…<br><br>
    To Your Continued Growth,<br>
    Team PASH.CLUB<br>www.PASH.club<br><br>
        ${disclaimer}
  `,
      isDefault: true,
    },
  ];

  for (const tpl of defaults) {
    try {
      await EmailTemplate.create(tpl);
      console.log(`✅ Created: ${tpl.name}`);
    } catch (e) {
      console.log(`⚠️ Skipped: ${tpl.name} - ${e.message}`);
    }
  }

  console.log("✅ All email templates seeded successfully!");
}

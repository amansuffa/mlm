import { EmailTemplate } from "@/models/EmailTemplate";

async function seedEmailTemplatesImpl() {
    const count = await EmailTemplate.countDocuments();
    if (count > 0) {
      console.log("⚠️ Email templates already exist, skipping seed.");
      return;
    }

    console.log("🚀 Seeding default email templates...");
    const href = process.env.NEXTAUTH_URL || "https://pash.club";

    const disclaimer = `
 
    <hr>
    <small>
    DISCLAIMER: This e-mail is NOT spam. You registered to receive this. Our system is tied to your email,
    so if you unsubscribe, we can't deliver your training, tips, and updates anymore — even those you paid for.
    If you ever want to stop receiving email from us, simply click the unsubscribe link below.
    <br><br>
    Important: To ensure our emails are delivered to your inbox, please add <strong>info@pash.club</strong>
    to your contacts list.
    <br><br>
    NOTE: PASH.CLUB is a professional training platform focused on skills development. There is no income guarantee; outcomes depend on individual effort and application. The Partner Program is optional and any peer contributions are processed directly between members; the company does not hold or manage partner funds.
    </small>
    <br><br>

  <a href="${href}/unsubscribe?email={{MemberEmail}}&token={{UnsubscribeToken}}"
     style="display:inline-block;
            padding:10px 18px;
            background:#e74c3c;
            color:#ffffff;
            text-decoration:none;
            border-radius:5px;
            font-size:14px;">
    Unsubscribe
  </a>
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
  The following member has completed signup and initial onboarding steps.<br><br>
  <strong>Details:</strong><br>
  • Name: {{MemberName}}<br>
  • Email: {{MemberEmail}}<br>
  • Username: {{MemberUsername}}<br>
  • Sponsor Name: {{SponsorName}}<br><br>
  The member may proceed with any required activation steps, including optional partner contributions processed peer-to-peer. The company does not hold or manage partner funds.<br><br>
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
        subject: "Admin Fee Step Completed – {{MemberName}}",
        body: `
      Hello Admin,<br><br>
  The following member has completed the one-time $50 admin step.<br><br>
  <strong>Details:</strong><br>
  • Name: {{MemberName}}<br>
  • Email: {{MemberEmail}}<br>
  • Username: {{MemberUsername}}<br>
  • Sponsor Name: {{SponsorName}}<br><br>
  The member may now proceed with activation steps. Any partner contributions are optional and processed directly between members.<br><br>
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
        subject: `Admin Fee Step Completed – {{MemberName}}`,
        body: `Hello Admin,<br><br>
  The following member has completed the one-time $50 admin step manually.<br><br>
  <strong>Details:</strong><br>
  • Name: {{MemberName}}<br>
  • Email: {{MemberEmail}}<br>
  • Username: {{MemberUsername}}<br>
  • Sponsor Name: {{SponsorName}}<br><br>
  The member is awaiting final activation confirmation. Any required partner contributions are handled directly between members; the company does not manage partner funds.<br><br>
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
        subject: "Membership Activation Sent – {{MemberName}}",
        body: `
       Hello Admin,<br><br>
  The following member has completed an activation step and notified their sponsor (or sponsor’s sponsor).<br><br>
  <strong>Details:</strong><br>
  • Name: {{MemberName}}<br>
  • Username: {{MemberUsername}}<br>
  • Action Date: {{PaymentDate}}<br>
  • Processed To: {{PaidTo}}<br>
  • Original Sponsor: {{SponsorName}}<br><br>
  Waiting for sponsor confirmation to finalize activation.<br><br>
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
        subject: "Member Activated – {{MemberName}}",
        body: `
         Hello Admin,<br><br>
  The following member’s activation has been confirmed by their sponsor, and their account is now fully activated.<br><br>
  <strong>Details:</strong><br>
  • Name: {{MemberName}}<br>
  • Username: {{MemberUsername}}<br>
  • Activated By: {{ActivatedBy}}<br>
  • Confirmed With: {{PaidTo}}<br>
  • Original Sponsor: {{SponsorName}}<br>
  • Activation Date: {{ActivationDate}}<br><br>
  The member now has full access to PASH.CLUB training, resources, and community features.<br><br>
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
   Hi {{MemberFirstName}},<br><br>
  Welcome to PASH.CLUB – we’re excited to have you on board! 🎉<br><br>
  Before we can activate your free member account, we just need to confirm your email address. This ensures you’ll receive important updates, training, and access details without missing anything.<br><br>
  👉 Please click the link below to confirm your email now:<br>
  <a href="{{ConfirmEmailLink}}" style="color:#007bff;text-decoration:none;">Confirm My Email Address</a><br><br>
  Once confirmed, you’ll get:<br>
  ✅ A Welcome Email<br>
  ✅ Step-by-step guidance on how to begin your learning path<br><br>
  If you didn’t sign up for PASH.CLUB, you can safely ignore this email.<br><br>
  We’re looking forward to supporting your professional growth.<br><br>
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
    Hi {{MemberFirstName}},<br><br>
  Welcome to PASH.CLUB – you just made a great decision to invest in your professional growth.<br><br>
  <strong>Your account credentials:</strong><br>
  • Name: {{MemberName}}<br>
  • Email: {{MemberEmail}}<br>
  • Username: {{MemberUsername}}<br>
  • Sponsor Name: {{SponsorName}}<br><br>
  You’ve successfully created your free account. To fully activate your membership please complete the remaining setup steps:<br><br>
  ✅ Complete the one-time $50 admin step – <a href="{{AdminFeeLink}}">Click here</a><br>
  ✅ Complete any optional partner contribution or membership activation steps directly with your sponsor (if applicable). The Partner Program is optional and any peer contributions are processed directly between members; the company does not hold or manage partner funds.<br><br>
  👉 <a href="{{AdminFeeLink}}">Complete your setup now »</a><br><br>
  We’re excited to support your learning journey.<br>
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
        subject: "Admin Step Received – Step 1 Done!",
        body: `
         Hi {{MemberFirstName}},<br><br>
  Thanks for completing the $50 admin step – Step 1 is complete ✅<br><br>
  Now it’s time for the final activation steps:<br>
  Login here: <a href="{{LoginLink}}">Go to Dashboard »</a><br><br>
  If your membership requires a partner contribution as part of activation, please complete that directly with your sponsor. The Partner Program is optional and any contributions are processed peer-to-peer; the company does not hold or manage partner funds.<br><br>
  This will give you:<br>
  ✅ Full access to your dashboard and training materials<br>
  ✅ Access to implementation resources and mentorship<br>
  ✅ Lifetime access to PASH.CLUB learning resources<br><br>
  Please download your invoice below if applicable.<br><br>
  We’re here to support your progress.<br>
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
        subject: "Membership Activation Sent – Awaiting Confirmation",
        body: `
       Hi {{MemberFirstName}},<br><br>
  We’ve been notified that you’ve completed the membership activation step (including any optional partner contribution). Your membership is now pending confirmation until your sponsor verifies the activation.<br><br>
  Once confirmed, your account will be activated and you’ll be able to access all training materials, implementation resources, and community support.<br><br>
  Please allow some time for confirmation. We’ll notify you as soon as your account is live.<br><br>
  Note: Participation in the optional Partner Program does not guarantee income. Outcomes depend on effort and application. The company does not hold or manage partner funds; peer contributions are processed directly between members.<br><br>
  To your professional growth,<br>
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
        body: `Hi {{MemberFirstName}},<br><br>
  🔥 Congrats – You’re now a fully activated member of PASH.CLUB!<br><br>
  You now have full access to our training curriculum, implementation tools, and community support.<br><br>
  Here’s what to do next:<br>
  ✅ Access your dashboard: <a href="{{LoginLink}}">Log in now »</a><br>
  ✅ Complete your onboarding lessons<br>
  ✅ Explore implementation templates and productivity systems<br>
  ✅ Connect with mentors and peers for practical guidance<br><br>
  Please note: Participation in the optional Partner Program is not required to access training, and does not guarantee income. Outcomes depend on individual effort and application. The company does not hold or manage partner funds; any peer contributions are processed directly between members.<br><br>
  We’re here to support your professional development every step of the way!<br><br>
  To your growth,<br>
  Team PASH.CLUB<br>
  www.PASH.club<br><br>
  ${disclaimer}`,
        isDefault: true,
      },
      {
        name: "User - 5 Hours After Activation – Action Plan",
        type: "user_action_plan",
        category: "User",
        subject: "Your First Steps to Apply Your Training",
        body: `
      Hi {{MemberFirstName}},<br><br>
  Now that you’re fully activated, here are recommended first steps to apply your training and begin practical implementation:<br><br>
  🎯 Step 1: Complete onboarding lessons and set up your dashboard<br>
  🎯 Step 2: Use the implementation templates provided in the resources section<br>
  🎯 Step 3: Connect with mentors and peers for guided application<br><br>
  🔗 <a href="{{LoginLink}}">Go to your dashboard and get started »</a><br><br>
  Remember: This is a training platform focused on skill development. There is no income guarantee; outcomes depend on individual effort and application. The Partner Program is optional and peer contributions are processed directly between members.
  <br><br>
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
        subject: "Network Activity: New Member Progress",
        body: `
      Hi {{MemberFirstName}},<br><br>
      🎉 A peer in your learning network has completed an activation milestone — that’s progress for your network!<br><br>
      👤 New Member Name: {{MemberName}}<br>
      📩 Email: {{MemberEmail}}<br>
      👤 Username: {{MemberUsername}}<br><br>
      Note: The platform supports an optional Partner Program and peer-to-peer contributions. Such contributions are processed directly between members; the company does not hold or manage partner funds. Participation in the Partner Program does not guarantee income. Outcomes depend on effort and application.<br><br>
      🔗 <a href="{{LoginLink}}">Log in to view network activity »</a><br><br>
      To your continued growth,<br>
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
        subject: "Network Update: Activity in Your Learning Network",
        body: `
      Hi {{MemberFirstName}},<br><br>
      Congratulations on recent activity in your learning network — progress like this helps the entire community grow.<br><br>
      👤 New Member Name: {{MemberName}}<br>
      📩 Email: {{MemberEmail}}<br>
      👤 Username: {{MemberUsername}}<br><br>
      Reminder: The Partner Program is optional and peer contributions are processed directly between members. The company does not hold or manage partner funds. Participation does not guarantee income; outcomes depend on individual effort and application.
  <br><br>
      Keep focusing on learning and practical application to achieve the best outcomes.<br><br>
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
        subject: "New Learner Joined Your Network",
        body: `
      Hi {{SponsorFirstName}},<br><br>
      Great news — a new learner joined your network via your link 🚀<br><br>
      👤 <strong>New Member Name:</strong> {{MemberName}}<br>
      📩 <strong>Email:</strong> {{MemberEmail}}<br>
      👤 <strong>Username:</strong> {{MemberUsername}}<br><br>
      They’ve created an account and are progressing through onboarding and activation steps. Any partner contributions are optional and handled directly between members.<br><br>
      Keep sharing resources and supporting newcomers to help your network grow.<br><br>
      To your continued leadership,<br>
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
        subject: "Referral Completed Initial Onboarding Step",
        body: `
        Hi {{SponsorFirstName}},<br><br>
        Your new referral has completed the initial onboarding step ✅<br><br>
        👤 <strong>New Member Name:</strong> {{MemberName}}<br>
        📩 <strong>Email:</strong> {{MemberEmail}}<br>
        👤 <strong>Username:</strong> {{MemberUsername}}<br><br>
        They are now progressing toward full activation. If an optional partner contribution is part of activation, it is handled directly between members; the company does not manage partner funds.<br><br>
        Stay tuned — you’ll be notified as they complete the next step.<br><br>
        Keep supporting your new member! 💪<br><br>
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
        subject: "Confirm Activation Step — Action Required",
        body: `
        Hi {{SponsorFirstName}},<br><br>
        A member in your network has indicated they completed an activation step. Please verify and confirm if required. 🎉<br><br>
        👤 <strong>New Member Name:</strong> {{MemberName}}<br>
        📩 <strong>Email:</strong> {{MemberEmail}}<br>
        👤 <strong>Username:</strong> {{MemberUsername}}<br><br>
        👉 Please log in to your back office and confirm once you have verified the activation:<br>
        🔗 <a href="{{LoginLink}}">{{LoginLink}}</a><br><br>
        ⚠️ <strong>Note:</strong> If any peer contribution is involved it is optional and processed directly between members; the company does not hold or manage partner funds.<br><br>
        Confirm now so your new member can access training and resources.<br><br>
          Team PASH.CLUB<br>www.PASH.club<br><br>
          ${disclaimer}
        `,
        isDefault: true,
      },
      {
        name: "Sponsor - Activated Downline",
        type: "sponsor_activated_downline",
        category: "Sponsor",
        subject: "You’ve Successfully Activated a New Member",
        body: `
         Congratulations {{SponsorFirstName}}! 🎉<br><br>
        You have confirmed the activation for a new member in your network, and their PASH.CLUB membership is now active! ✅<br><br>
        👤 <strong>New Downline Member Name:</strong> {{MemberName}}<br>
        📩 <strong>Email:</strong> {{MemberEmail}}<br>
        👤 <strong>Username:</strong> {{MemberUsername}}<br><br>
        This means:<br>
        • They’re now a fully active member under your network<br>
        • They can access training materials and implementation resources<br>
        • You’ve helped grow your professional learning network 💪<br><br>
        Fantastic job — keep supporting your network and sharing best practices!<br><br>
        To Your Continued Growth,<br>
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
        subject: "Network Activity: A Learner in Your Extended Network Progressed",
        body: `
      Hi {{SponsorUplineFirstName}},<br><br>
      Good news — a learner in your extended network has progressed through an activation step. This activity helps strengthen the learning ecosystem around you.<br><br>
      👥 Downline Member Name: {{SponsorName}}<br>
      👥 Downline Member Email: {{SponsorEmail}}<br><br>
      👤 New Member Name: {{MemberName}}<br>
      📩 Member Email: {{MemberEmail}}<br>
      👤 Member Username: {{MemberUsername}}<br><br>
      Note: The Partner Program is optional and any peer contributions are handled directly between members; the company does not hold or manage partner funds. Participation does not guarantee income — the platform focuses on skill development and implementation.
  <br><br>
      🔗 Log in to check network activity » <a href="{{LoginLink}}">{{LoginLink}}</a><br><br>
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
        subject: "Confirm Activation in Your Extended Network",
        body: `
      Hi {{SponsorUplineFirstName}},<br><br>
      A member in your extended network has indicated they completed an activation step. Please verify if required.<br><br>
      👤 New Member Name: {{MemberName}}<br>
      📩 Email: {{MemberEmail}}<br>
      👤 Username: {{MemberUsername}}<br>
      👤 Original Sponsor Name: {{SponsorName}}<br><br>
      👉 Please log in to your back office and confirm any required activation:<br>
      🔗 <a href="{{LoginLink}}">{{LoginLink}}</a><br><br>
      ⚠️ Note: If any peer contribution is involved it is optional and processed directly between members; the company does not hold or manage partner funds. Participation does not guarantee income.
  <br><br>
      Confirm now so your network member can access training and resources.<br><br>
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
          "You’ve Successfully Activated a New Member in Your Extended Network",
        body: `
      Congratulations {{SponsorUplineFirstName}}! 🎉<br><br>
      You have confirmed the activation for a new member in your extended network and their PASH.CLUB membership is now active! ✅<br><br>
      👤 New Passed-Up Downline Member Name: {{MemberName}}<br>
      📩 Email: {{MemberEmail}}<br>
      👤 Username: {{MemberUsername}}<br>
      👤 Original Sponsor Name: {{SponsorName}}<br><br>
      This means:<br>
      • They’re now a fully active member under your extended network<br>
      • They can access training and implementation resources<br>
      • You’ve helped grow the professional learning community 💪<br><br>
      Fantastic job — keep supporting your network and sharing best practices!<br><br>
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

  export async function seedEmailTemplates() {
    return await seedEmailTemplatesImpl();
  }


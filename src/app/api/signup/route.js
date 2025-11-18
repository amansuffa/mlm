import { NextResponse } from "next/server";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";
import { EmailTemplate } from "@/models/EmailTemplate";
import { parseTemplate } from "@/lib/parseTemplate";


export async function POST(req) {
  try {
    const { email, password, firstName, middleName, lastName, username, sponsorUsername, countryCode, phoneNumber, city, province, country, checkEmail } = await req.json();
    await connectDB();

    // Email availability check endpoint
    if (checkEmail) {
      const existingUser = await User.findOne({ email });
      return NextResponse.json({ available: !existingUser });
    }

    // Check for banned countries
    const bannedCountries = ["Pakistan", "Somalia", "Sudan", "Democratic Republic of Congo", "Yemen"];
    if (bannedCountries.includes(country)) {
      return NextResponse.json(
        { error: "Registration not available in your country due to regulatory restrictions" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    user = await User.findOne({ username });
    if (user) {
      return NextResponse.json(
        { error: "Username is not available" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    // If no sponsorUsername, set to admin's username
    let finalReferredBy = sponsorUsername;
    if (!sponsorUsername || sponsorUsername === "Admin") {
      const admin = await User.findOne({ role: "admin" });
      finalReferredBy = admin ? admin.username : "Admin";
    } else {
      // Verify that the referrer exists
      const referrer = await User.findOne({ username: sponsorUsername });
      if (!referrer) {
        return NextResponse.json(
          { error: "Invalid sponsor username" },
          { status: 400 }
        );
      }
    }
    const token = crypto.randomBytes(20).toString("hex");

    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      firstName,
      middleName,
      lastName,
      email,
      username,
      phone: {
        countryCode,
        number: phoneNumber
      },
      address: {
        city,
        province,
        country
      },
      password: hashedPassword,
      referredBy: finalReferredBy,
      isVerified: false,
      verificationToken: token,
    });

 

    // verification link
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;
    // Find email reciever
    const sponsor = await User.findOne({ username: finalReferredBy });
    const admin = await User.findOne({ role: "admin" });
    // Find email templates
    const userTemplate = await EmailTemplate.findOne({ type: "user_confirm_email" });
    const sponsorTemplate = await EmailTemplate.findOne({ type: "sponsor_new_referral" });
    const adminTemplate = await EmailTemplate.findOne({ type: "admin_new_signup" });
    
    const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim();
    const templateData = {
      MemberFirstName: firstName,
      MemberName: fullName,
      MemberEmail: email,
      MemberUsername: username,
      SponsorName: sponsor?.firstName ? `${sponsor.firstName} ${sponsor.lastName}` : sponsor?.name || 'N/A',
      SponsorFirstName: sponsor?.firstName || 'N/A',
      VerificationLink: verifyUrl,
      ConfirmEmailLink: verifyUrl
    };
    
    // Send email to user
    if (userTemplate) {
      try {
        const userHtml = parseTemplate(userTemplate.body, templateData);
        await sendEmail(email, userTemplate.subject, userHtml);
        console.log(`✅ Signup verification email sent to ${email}`);
      } catch (error) {
        console.error(`❌ Failed to send signup verification email to ${email}:`, error);
      }
    }
    
    // Send email to sponsor
    if (sponsorTemplate && sponsor) {
      try {
        const sponsorHtml = parseTemplate(sponsorTemplate.body, templateData);
        await sendEmail(sponsor.email, sponsorTemplate.subject, sponsorHtml);
        console.log(`✅ New referral email sent to sponsor ${sponsor.email}`);
      } catch (error) {
        console.error(`❌ Failed to send new referral email to sponsor ${sponsor.email}:`, error);
      }
    }
    
    // Send email to admin
    if (adminTemplate && admin) {
      try {
        const adminHtml = parseTemplate(adminTemplate.body, templateData);
        await sendEmail(admin.email, adminTemplate.subject, adminHtml);
        console.log(`✅ New signup email sent to admin ${admin.email}`);
      } catch (error) {
        console.error(`❌ Failed to send new signup email to admin ${admin.email}:`, error);
      }
    }
    
    // Fallback if no user template exists
    if (!userTemplate) {
      try {
        const defaultHtml = `
          <h2>Verify Your Email</h2>
          <p>Hi ${firstName},</p>
          <p>Thanks for signing up! Please click the link below to verify your email:</p>
          <a href="${verifyUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${verifyUrl}</p>
          <p>If you didn't create an account, you can ignore this email.</p>
        `;
        await sendEmail(email, "Verify your email", defaultHtml);
        console.log(`✅ Default verification email sent to ${email}`);
      } catch (error) {
        console.error(`❌ Failed to send default verification email to ${email}:`, error);
      }
    }

  

  

    return NextResponse.json(
      {
        message: "Signup successful",
        user: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          middleName: newUser.middleName,
          lastName: newUser.lastName,
          username: newUser.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
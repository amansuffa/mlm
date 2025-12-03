import sgMail from "@sendgrid/mail";


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export async function sendEmail(to, subject, html) {
  if (to.isUnsubscribed) {
  console.log("User unsubscribed — skipping email");
  return;
}

  const msg = {
    to,
    from: `${process.env.SENDGRID_FROM_EMAIL}`,
    subject,
    html,
  };
  await sgMail.send(msg);
  console.log("✅ SendGrid email sent to", to);
}


// import nodemailer from "nodemailer";
 

// export async function sendEmail(to, subject, html) {
//   try {
//     // SMTP transporter setup
//     // const transporter = nodemailer.createTransport({
//     //   host: process.env.SMTP_HOST || "smtp.gmail.com",
//     //   port: process.env.SMTP_PORT || 587,
//     //   secure: false, 
//     //   auth: {
//     //     user: process.env.SMTP_USER, // your email
//     //     pass: process.env.SMTP_PASS, // app password or SMTP password
//     //   },
//     // });



//   // transporter config
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // ya smtp.mailtrap.io
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Mail details
//     const mailOptions = {
//       from: `"Pash Club" <${process.env.Email_USER}>`, // sender name
//       to,
//       subject,
//       html,
//     };

//     // Send mail
//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("❌ Email send failed:", error);
//     throw new Error("Email send failed");
//   }
// }
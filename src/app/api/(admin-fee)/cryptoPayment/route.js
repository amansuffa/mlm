// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { amount, pay_currency,user } = await req.json();

//     const response = await axios.post(
//       "https://api.nowpayments.io/v1/invoice",
//       {
//         price_amount: amount,
//         price_currency: "usd",
//         pay_currency: pay_currency,
//         order_id: `admin-fee-${Date.now()}`,
//         order_description: "Admin Fee Payment",
//         ipn_callback_url:
//           "https://d37e97489ea0.ngrok-free.app/api/payment-callback",

//         success_url: "https://website.com/payment-success",
//         cancel_url: "https://website.com/payment-failed",
//       },
//       {
//         headers: {
//           "x-api-key": process.env.NOWPAYMENTS_API_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return NextResponse.json(response.data);
//   } catch (error) {
//     console.error("NOWPayments Error:", error.response?.data || error.message);
//     return NextResponse.json(
//       { error: "Payment creation failed" },
//       { status: 500 }
//     );
//   }
// }
// /api/cryptoPayment/route.js

import axios from "axios";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req) {
  await connectDB();

  try {
    const { amount, pay_currency, user } = await req.json();

    // 🧾 Step 1: Create new invoice from NOWPayments
    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: "usd",
        pay_currency,
        order_id: `admin-fee-${Date.now()}`,
        order_description: "Admin Fee Payment",
        ipn_callback_url:
          "https://d37e97489ea0.ngrok-free.app/api/payment-callback",
        success_url: "https://yourwebsite.com/payment-success",
        cancel_url: "https://yourwebsite.com/payment-failed",
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const invoiceData = response.data;

    // 🛑 Step 2: Check existing pending payment for this user
    const existingPayment = await Payment.findOne({
      user_id: user.id,
      status: "pending",
    });

    if (existingPayment) {
      // 🔁 Update old record with new invoice details
      await Payment.findByIdAndUpdate(existingPayment._id, {
        order_id: invoiceData.order_id,
        amount,
        pay_currency,
        status: "pending",
        updatedAt: new Date(),
      });

      console.log("🔄 Updated old pending payment:", invoiceData.order_id);
    } else {
      // 🆕 Create a new record if no pending one
      await Payment.create({
        order_id: invoiceData.order_id,
        user_id: user.id,
        name: user.name,
        email: user.email,
        amount,
        currency: "usd",
        pay_currency,
        status: "pending",
      });

      console.log("🆕 Created new pending payment:", invoiceData.order_id);
    }

    // 🧾 Step 3: Return invoice URL to frontend
    return NextResponse.json({ invoice_url: invoiceData.invoice_url });
  } catch (error) {
    console.error("Crypto payment error:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

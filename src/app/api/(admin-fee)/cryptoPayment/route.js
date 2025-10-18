import axios from "axios";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import crypto from "crypto";
import { User } from "@/models/User";

export async function POST(req) {
  await connectDB();

  try {
    const { amount, pay_currency, userId } = await req.json();
    const order_id = crypto.randomBytes(10).toString("hex"); // signup k time create kren ge
    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: "usd",
        pay_currency: pay_currency,
        order_id: order_id,
        order_description: "Admin Fee Payment",
        ipn_callback_url: `${process.env.NGROK_URL}/api/payment-callback`,
        success_url: `${process.env.NGROK_URL}/success`,
        cancel_url: `${process.env.NGROK_URL}/cancel`,
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const invoiceData = response.data;
    console.log("Invoice Data:", invoiceData);

    const existingPayment = await Payment.findOne({
      user_id: userId,
      status: "pending",
    });

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
console.log("user found for payment:", userId);

    if (existingPayment) {
      await Payment.findByIdAndUpdate(existingPayment._id, {
        order_id: invoiceData.order_id,
        amount,
        pay_currency,
        status: "pending",
        updatedAt: new Date(),
      });

      console.log("Updated old pending payment:", invoiceData.order_id);
    } else {
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

      console.log("Created new pending payment:", invoiceData.order_id);
    }

    return NextResponse.json({ invoice_url: invoiceData.invoice_url });
  } catch (error) {
    console.error(
      "Crypto payment error:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Payment creation failed" },
      { status: 500 }
    );
  }
}

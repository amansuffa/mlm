import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, pay_currency } = await req.json();

    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: "usd",
        pay_currency: pay_currency,
        order_id: `admin-fee-${Date.now()}`,
        order_description: "Admin Fee Payment",
        ipn_callback_url:
          "https://d37e97489ea0.ngrok-free.app/api/payment-callback",

        success_url: "https://website.com/payment-success",
        cancel_url: "https://website.com/payment-failed",
      },
      {
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("NOWPayments Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Payment creation failed" },
      { status: 500 }
    );
  }
}

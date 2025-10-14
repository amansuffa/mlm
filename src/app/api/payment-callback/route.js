import { updatePaymentStatus } from "@/utils/updatePaymentStatus";
export async function POST(request) {
  try {
    const paymentData = await request.json();
    
    console.log("PAYMENT RECEIVED:", paymentData);
    
    if (paymentData.payment_status === "finished") {
      console.log("Payment successful for order:", paymentData.order_id);
      
      await updatePaymentStatus(paymentData.order_id, "paid");
      
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error("IPN Error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
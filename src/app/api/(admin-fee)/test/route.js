export async function GET(request) {
  try {
 
    
    return Response.json({ test: "hello testing", success: true });
  } catch (error) {
    console.error("IPN Error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
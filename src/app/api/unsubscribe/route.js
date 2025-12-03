import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const user = await User.findOne({ email, unsubscribeToken: token });
  if (!user) {
    return Response.json({ error: "Invalid link" }, { status: 400 });
  }

  user.isUnsubscribed = true;
  await user.save();

  return Response.json({ message: "You have been unsubscribed successfully." });
}
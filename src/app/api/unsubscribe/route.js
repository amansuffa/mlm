import {User} from "@/models/User";
import { connectDB } from "@/lib/mongodb";


export async function POST(req) {
  await connectDB();
  const { token } = await req.json();

  const user = await User.findOne({ unsubscribeToken: token });
  if (!user) {
    return Response.json({ error: "Invalid link" }, { status: 400 });
  }

  user.isUnsubscribed = true;
  await user.save();

  return Response.json({ message: "You have been unsubscribed successfully.",success: true }, { status: 200 });
}
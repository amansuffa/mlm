import { NextResponse } from "next/server";
import { EmailTemplate } from "@/models/EmailTemplate";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { hasPermission } from "@/app/actions/hasPermission";



export async function GET(req) {
  await connectDB();
    const session = await auth();
    console.log("session", session.user);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id

        const hasUserPermission = await hasPermission(userId);
    
    if (!hasUserPermission) {
      return NextResponse.json(
        { error: "Only admin and paid members can create blogs" },
        { status: 403 }
      );
    }


  // admin sees all
  if (session.user.role === "admin") {
    const all = await EmailTemplate.find().sort({ createdAt: -1 });
    return NextResponse.json(all);
  }

  // user sees their own templates only
//   const mine = await EmailTemplate.find({ ownerId: session.user._id }).sort({ createdAt: -1 });
//   return NextResponse.json(mine);

  // Regular user → see default + global (ownerId=null) + their own
  const templates = await EmailTemplate.find({
    $or: [
      { isDefault: true },
      { ownerId: null }, // admin/global
      { ownerId: user._id }
    ]
  }).sort({ createdAt: -1 });

  return NextResponse.json(templates);


}

export async function POST(req) {
  await connectDB();
    const session = await auth();
    console.log("session", session.user);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id

    
    const hasUserPermission = await hasPermission(userId);
if (!hasUserPermission) {
      return NextResponse.json(
        { error: "Only admin and paid members can create templates" },
        { status: 403 }
      );
    }


  const body = await req.json();
  const tpl = await EmailTemplate.create({
    title: body.title,
    subject: body.subject,
    body: body.body,
    ownerId: session.user.role === "admin" ? null : userId
  });

  return NextResponse.json(tpl, { status: 201 });
}

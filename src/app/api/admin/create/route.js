import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin already exists" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      status: "fully_active",
      username: "admin123",
       isVerified: true, 
         adminFeePaid: true,
  membershipFeePaid: true,
    });

    return new Response(
      JSON.stringify({
        message: "Admin created successfully",
        referralId: admin.referralId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin creation error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}

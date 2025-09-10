import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User"; // ✅ Ensure this matches your export
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin already exists" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referralId automatically
    const referralId = "ADMIN" + Math.floor(100000 + Math.random() * 900000);

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      status: "Admin fee paid",
      referralId,
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

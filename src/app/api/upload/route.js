import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("video");
    const folder = formData.get("folder") || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    try {
      const url = await uploadToCloudinary(file, folder);
      return NextResponse.json({ url });
    } catch (err) {
      console.error("Cloudinary upload error (single file):", err);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
  } catch (err) {
    console.error("Error in /api/upload:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}


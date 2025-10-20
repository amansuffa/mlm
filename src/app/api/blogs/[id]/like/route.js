import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { BlogLike } from "@/models/BlogLike";

export async function POST(request, context) {
  await connectDB();
  const { id } = await context.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const existingLike = await BlogLike.findOne({ blogId: id, ip });
    if (existingLike) {
      return NextResponse.json({ message: "Already liked" }, { status: 200 });
    }

    await BlogLike.create({ blogId: id, ip });

    blog.likes = (blog.likes || 0) + 1;
    if (!Array.isArray(blog.likedBy)) {
      blog.likedBy = [];
    }

    let liked = false; 

    if (blog.likedBy.includes(ip)) {
        
      blog.likedBy = blog.likedBy.filter((x) => x !== ip);
      liked = false;
    } else {
      blog.likedBy.push(ip);
      liked = true;
    }
    await blog.save();

    return NextResponse.json({
      success: true,
      liked,
      likesCount: blog.likes.length,
    });
  } catch (error) {
    console.error("Error liking blog:", error);
    return NextResponse.json({ error: "Failed to like blog" }, { status: 500 });
  }
}

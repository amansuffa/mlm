import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { BlogLike } from "@/models/BlogLike";

export async function POST(request, context) {
  await connectDB();
  const { id } = await context.params;

  try {
    const blog = await Blog.findOne({ slug: id }) || await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check if already liked
    const existingLike = await BlogLike.findOne({ blogId: blog._id, ip });
    
    if (existingLike) {
      // Unlike - remove the like
      await BlogLike.deleteOne({ blogId: blog._id, ip });
      
      // Update blog likes count
      blog.likes = Math.max(0, (blog.likes || 0) - 1);
      
      // Update likedBy array
      if (Array.isArray(blog.likedBy)) {
        blog.likedBy = blog.likedBy.filter(ipAddr => ipAddr !== ip);
      }
      
      await blog.save();

      return NextResponse.json({
        success: true,
        liked: false,
        likesCount: blog.likes
      });
    } else {
      // Like - add new like
      await BlogLike.create({ blogId: blog._id, ip });

      // Update blog likes count
      blog.likes = (blog.likes || 0) + 1;
      
      // Update likedBy array
      if (!Array.isArray(blog.likedBy)) {
        blog.likedBy = [];
      }
      if (!blog.likedBy.includes(ip)) {
        blog.likedBy.push(ip);
      }
      
      await blog.save();

      return NextResponse.json({
        success: true,
        liked: true,
        likesCount: blog.likes
      });
    }
  } catch (error) {
    console.error("Error liking blog:", error);
    return NextResponse.json({ error: "Failed to like blog" }, { status: 500 });
  }
}

// GET endpoint to check like status
export async function GET(request, context) {
  await connectDB();
  const { id } = await context.params;

  try {
    const blog = await Blog.findOne({ slug: id }) || await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const existingLike = await BlogLike.findOne({ blogId: blog._id, ip });
    const liked = !!existingLike;

    return NextResponse.json({
      success: true,
      liked,
      likesCount: blog.likes || 0
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 });
  }
}
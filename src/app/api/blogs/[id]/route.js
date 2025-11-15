import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { BlogView } from "@/models/BlogView";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";

export async function GET(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const blog = await Blog.findById(id).populate("authorId", "name username");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Get user IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check if this IP has already viewed the blog
    const existingView = await BlogView.findOne({ blogId: blog._id, ip });

    if (!existingView) {
      // Create a new view record
      await BlogView.create({ blogId: blog._id, ip });

      // Increment blog view count
      blog.views = (blog.views || 0) + 1;
      await blog.save();
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// UPDATE a blog
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const excerpt = formData.get("excerpt");
    const tags = formData.get("tags");
    const keywords = formData.get("keywords");
    const category = formData.get("category");

    // Handle optional thumbnail upload
    let thumbnailUrl = null;
    const thumbnail = formData.get("thumbnail");
    if (thumbnail && typeof thumbnail === "object") {
      thumbnailUrl = await uploadToCloudinary(thumbnail, "blog-thumbnails");
    }

    // Handle images (if any)
    const images = [];
    const imagesFiles = formData.getAll("images");
    for (const img of imagesFiles) {
      const url = await uploadToCloudinary(img, "blog-images");
      images.push(url);
    }

    // Handle videos (if any)
    const videos = [];
    const videosFiles = formData.getAll("videos");
    for (const vid of videosFiles) {
      const url = await uploadToCloudinary(vid, "blog-videos");
      videos.push(url);
    }

    // Handle video links
    const videoLinks = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("videoLinks[")) {
        videoLinks.push(value);
      }
    }

    // Prepare update object
    const updateData = {
      title,
      content,
      excerpt,
      tags,
      keywords,
      category,
      images,
      videos,
      videoLinks,
    };

    // Only update thumbnail if a new one was uploaded
    if (thumbnailUrl) {
      updateData.thumbnail = thumbnailUrl;
    }

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

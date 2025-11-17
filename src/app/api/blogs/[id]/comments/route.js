import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {Comment} from "@/models/Comment";
import {Blog} from "@/models/Blog";
import { connectDB } from "@/lib/mongodb";

// GET - Fetch comments for a blog
export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const comments = await Comment.find({ blogId: id, parentId: null })
      .populate("userId", "name username profilePicture")
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "name username"
        }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Add new comment or reply
export async function POST(request, context) {
  try {
    const session = await auth();
    console.log("Session:", session);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Please login to comment" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await context.params;
    const { content, parentId } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    const comment = new Comment({
      content: content.trim(),
      blogId: id,
      userId: session.user.id,
      parentId: parentId || null
    });

    await comment.save();

    // If it's a reply, add to parent comment's replies array
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: comment._id }
      });
    }

    // Populate the user data
    await comment.populate("userId", "name username profilePicture");

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Comment POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
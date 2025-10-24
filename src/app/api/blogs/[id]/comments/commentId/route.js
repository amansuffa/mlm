import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Comment from "@/models/Comment";
import { connectDB } from "@/lib/mongodb";

// DELETE - Delete a comment
export async function DELETE(request, context) {
  try {
    const session = await auth(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id, commentId } = context.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if user owns the comment or is admin
    if (comment.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    // If it's a parent comment, delete all replies first
    if (comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    // If it's a reply, remove from parent's replies array
    if (comment.parentId) {
      await Comment.findByIdAndUpdate(comment.parentId, {
        $pull: { replies: commentId }
      });
    }

    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
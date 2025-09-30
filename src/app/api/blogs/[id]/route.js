import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/models/Blog"; 



export async function GET(request, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const blog = await Blog.findById(id).populate("authorId", "name username");

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
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
    
    const { title, content } = await req.json();

    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      { title, content },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

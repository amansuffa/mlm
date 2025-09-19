import { NextResponse } from "next/server";
import {Blog} from "@/models/Blog";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";

// Helper function to check if user has permission to create/edit/delete blogs
async function hasPermission(userId) {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return false;
    }
    
    // Admin users always have permission
    if (user.role === "admin") {
      return true;
    }
    
    // Paid members have permission (membership_paid or fully_active)
    if (user.status === "membership_paid" || user.status === "fully_active") {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking user permissions:", error);
    return false;
  }
}

// GET all blogs
// export async function GET(request) {
//   try {
//     await connectToDatabase();
    
//     // Get query parameters for pagination
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;
    
//     // Find blogs with pagination and populate author info
//     const blogs = await Blog.find({})
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("authorId", "name username");
    
//     const total = await Blog.countDocuments({});
    
//     return NextResponse.json({
//       blogs,
//       pagination: {
//         total,
//         page,
//         limit,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching blogs:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch blogs" },
//       { status: 500 }
//     );
//   }
// }

// POST create a new blog (admin and paid members only)
export async function POST(request) {
  try {
    await connectDB();
    
    // Get the current user session
    const session = await auth();
    console.log("session", session.user);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id
//    const { searchParams } = new URL(request.url);
// let userId = searchParams.get("userId");
    
    // Check if user has permission
    const hasUserPermission = await hasPermission(userId);
    
    if (!hasUserPermission) {
      return NextResponse.json(
        { error: "Only admin and paid members can create blogs" },
        { status: 403 }
      );
    }
    
    // Parse request body
    const { title, content } = await request.json();
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }
    
    // Create new blog
    const newBlog = new Blog({
      authorId: userId,
      title,
      content,
      shares: []
    });
    
    await newBlog.save();
    
    return NextResponse.json(
      { message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

// PUT update a blog (admin and paid members only)
// export async function PUT(request) {
//   try {
//     await connectToDatabase();
    
//     // Get the current user session
//     const session = await getServerSession(authOptions);
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }
    
//     // Parse request body
//     const { blogId, title, content } = await request.json();
    
//     // Validate required fields
//     if (!blogId || !title || !content) {
//       return NextResponse.json(
//         { error: "Blog ID, title, and content are required" },
//         { status: 400 }
//       );
//     }
    
//     // Find the blog
//     const blog = await Blog.findById(blogId);
    
//     if (!blog) {
//       return NextResponse.json(
//         { error: "Blog not found" },
//         { status: 404 }
//       );
//     }
    
//     // Check if user is the author or an admin
//     const isAuthor = blog.authorId.toString() === session.user.id;
//     const isAdmin = (await User.findById(session.user.id))?.role === "admin";
    
//     if (!isAuthor && !isAdmin) {
//       return NextResponse.json(
//         { error: "You can only edit your own blogs" },
//         { status: 403 }
//       );
//     }
    
//     // If not admin, check if user has permission
//     if (!isAdmin) {
//       const hasUserPermission = await hasPermission(session.user.id);
      
//       if (!hasUserPermission) {
//         return NextResponse.json(
//           { error: "Only admin and paid members can edit blogs" },
//           { status: 403 }
//         );
//       }
//     }
    
//     // Update the blog
//     blog.title = title;
//     blog.content = content;
//     await blog.save();
    
//     return NextResponse.json(
//       { message: "Blog updated successfully", blog }
//     );
//   } catch (error) {
//     console.error("Error updating blog:", error);
//     return NextResponse.json(
//       { error: "Failed to update blog" },
//       { status: 500 }
//     );
//   }
// }

// DELETE a blog (admin and paid members only)
// export async function DELETE(request) {
//   try {
//     await connectToDatabase();
    
//     // Get the current user session
//     const session = await getServerSession(authOptions);
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }
    
//     // Get blog ID from URL
//     const { searchParams } = new URL(request.url);
//     const blogId = searchParams.get("id");
    
//     if (!blogId) {
//       return NextResponse.json(
//         { error: "Blog ID is required" },
//         { status: 400 }
//       );
//     }
    
//     // Find the blog
//     const blog = await Blog.findById(blogId);
    
//     if (!blog) {
//       return NextResponse.json(
//         { error: "Blog not found" },
//         { status: 404 }
//       );
//     }
    
//     // Check if user is the author or an admin
//     const isAuthor = blog.authorId.toString() === session.user.id;
//     const isAdmin = (await User.findById(session.user.id))?.role === "admin";
    
//     if (!isAuthor && !isAdmin) {
//       return NextResponse.json(
//         { error: "You can only delete your own blogs" },
//         { status: 403 }
//       );
//     }
    
//     // If not admin, check if user has permission
//     if (!isAdmin) {
//       const hasUserPermission = await hasPermission(session.user.id);
      
//       if (!hasUserPermission) {
//         return NextResponse.json(
//           { error: "Only admin and paid members can delete blogs" },
//           { status: 403 }
//         );
//       }
//     }
    
//     // Delete the blog
//     await Blog.findByIdAndDelete(blogId);
    
//     return NextResponse.json(
//       { message: "Blog deleted successfully" }
//     );
//   } catch (error) {
//     console.error("Error deleting blog:", error);
//     return NextResponse.json(
//       { error: "Failed to delete blog" },
//       { status: 500 }
//     );
//   }
// }

// PATCH share a blog (available to all users)
// export async function PATCH(request) {
//   try {
//     await connectToDatabase();
    
//     // Get the current user session
//     const session = await getServerSession(authOptions);
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }
    
//     // Parse request body
//     const { blogId } = await request.json();
    
//     if (!blogId) {
//       return NextResponse.json(
//         { error: "Blog ID is required" },
//         { status: 400 }
//       );
//     }
    
//     // Find the blog
//     const blog = await Blog.findById(blogId);
    
//     if (!blog) {
//       return NextResponse.json(
//         { error: "Blog not found" },
//         { status: 404 }
//       );
//     }
    
//     // Check if user has already shared this blog
//     const alreadyShared = blog.shares.some(
//       share => share.userId.toString() === session.user.id
//     );
    
//     if (alreadyShared) {
//       return NextResponse.json(
//         { error: "You have already shared this blog" },
//         { status: 400 }
//       );
//     }
    
//     // Add user to shares
//     blog.shares.push({
//       userId: session.user.id,
//       sharedAt: new Date()
//     });
    
//     await blog.save();
    
//     return NextResponse.json(
//       { message: "Blog shared successfully", blog }
//     );
//   } catch (error) {
//     console.error("Error sharing blog:", error);
//     return NextResponse.json(
//       { error: "Failed to share blog" },
//       { status: 500 }
//     );
//   }
// }
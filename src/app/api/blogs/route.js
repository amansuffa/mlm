import { NextResponse } from "next/server";
import { Blog } from "@/models/Blog";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { uploadToCloudinary } from "@/lib/uploadCloudinary";

import { hasPermission } from "@/app/actions/hasPermission";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const myBlogsOnly = searchParams.get("my") === "true";

    let filter = {};

    if (myBlogsOnly) {
      try {
        const session = await auth();
        if (!session?.user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        filter.authorId = session.user.id;
      } catch (err) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "name username");

    const total = await Blog.countDocuments(filter);

    return NextResponse.json({
      blogs: blogs || [],
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      message: blogs.length === 0 ? "No blogs found" : null,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST create a new blog (admin and paid members only)
export async function POST(request) {
  try {
    await connectDB();

    // Check user authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check permissions
    const hasUserPermission = await hasPermission(userId);
    if (!hasUserPermission) {
      return NextResponse.json(
        { error: "Only admin and paid members can create blogs" },
        { status: 403 }
      );
    }

    // Get FormData — wrap in try/catch because body may be locked/consumed
    let formData;
    try {
      formData = await request.formData();
    } catch (err) {
      console.error('Error parsing formData (maybe body was consumed or locked):', err);
      return NextResponse.json({ error: 'Invalid request body or body already consumed' }, { status: 400 });
    }

    const title = formData.get("title");
    const content = formData.get("content");
    const excerpt = formData.get("excerpt");
    const tags = formData.get("tags");
    const keywords = formData.get("keywords");
    const category = formData.get("category");

    // File size limits (bytes)
    const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2 MB
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB per image
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 25 MB per video

    // Handle thumbnail upload with size check
    let thumbnailUrl = null;
    const thumbnail = formData.get("thumbnail");
    if (thumbnail && typeof thumbnail === "object") {
      if (typeof thumbnail.size === "number" && thumbnail.size > MAX_THUMBNAIL_SIZE) {
        return NextResponse.json({ error: `Thumbnail too large. Maximum ${Math.round(MAX_THUMBNAIL_SIZE / (1024*1024))} MB allowed.` }, { status: 413 });
      }
      try {
        thumbnailUrl = await uploadToCloudinary(thumbnail, "blog-thumbnails");
        console.log("Cloudinary thumbnail URL:", thumbnailUrl);
      } catch (err) {
        console.error("Cloudinary upload error (thumbnail):", err);
        if (err?.http_code === 499 || err?.name === "TimeoutError") {
          return NextResponse.json({ error: "Thumbnail upload timed out. Please try again with a smaller file or a faster connection." }, { status: 504 });
        }
        return NextResponse.json({ error: "Failed to upload thumbnail" }, { status: 500 });
      }
    }

    // Handle multiple images
    const images = [];
    const imagesFiles = formData.getAll("images");
    // Check image sizes first
    for (const img of imagesFiles) {
      if (img && typeof img === "object" && typeof img.size === "number" && img.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: `One of the images is too large. Maximum ${Math.round(MAX_IMAGE_SIZE / (1024*1024))} MB per image.` }, { status: 413 });
      }
    }
    for (const img of imagesFiles) {
      try {
        const url = await uploadToCloudinary(img, "blog-images");
        console.log("Cloudinary image URL:", url);
        images.push(url);
      } catch (err) {
        console.error("Cloudinary upload error (image):", err);
        if (err?.http_code === 499 || err?.name === "TimeoutError") {
          return NextResponse.json({ error: "Image upload timed out. Please try smaller images or a faster connection." }, { status: 504 });
        }
        return NextResponse.json({ error: "Failed to upload one of the images" }, { status: 500 });
      }
    }

    // Handle multiple videos
    const videos = [];
    const videosFiles = formData.getAll("videos");
    // Check video sizes first
    for (const vid of videosFiles) {
      if (vid && typeof vid === "object" && typeof vid.size === "number" && vid.size > MAX_VIDEO_SIZE) {
        return NextResponse.json({ error: `One of the videos is too large. Maximum ${Math.round(MAX_VIDEO_SIZE / (1024*1024))} MB per video.` }, { status: 413 });
      }
    }
    for (const vid of videosFiles) {
      try {
        const url = await uploadToCloudinary(vid, "blog-videos");
        console.log("Cloudinary video URL:", url);
        videos.push(url);
      } catch (err) {
        console.error("Cloudinary upload error (video):", err);
        if (err?.http_code === 499 || err?.name === "TimeoutError") {
          return NextResponse.json({ error: "Video upload timed out. Please try a smaller video or a faster connection." }, { status: 504 });
        }
        return NextResponse.json({ error: "Failed to upload one of the videos" }, { status: 500 });
      }
    }

    // Handle video links
    const videoLinks = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("videoLinks[")) {
        videoLinks.push(value);
      }
    }

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Create new Blog document
    const newBlog = new Blog({
      authorId: userId,
      title,
      content,
      excerpt,
      tags,
      keywords,
      category,
      thumbnail: thumbnailUrl,
      images,
      videos,
      videoLinks,
      shares: [],
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
export async function PUT(request) {
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

    // Parse request body
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");
    const { title, content } = await request.json();

    // Validate required fields
    if (!blogId || !title || !content) {
      return NextResponse.json(
        { error: "Blog ID, title, and content are required" },
        { status: 400 }
      );
    }

    // Find the blog
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if user is the author or an admin
    const isAuthor = blog.authorId.toString() === session.user.id;
    const isAdmin = (await User.findById(session.user.id))?.role === "admin";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You can only edit your own blogs" },
        { status: 403 }
      );
    }

    // If not admin, check if user has permission
    if (!isAdmin) {
      const hasUserPermission = await hasPermission(session.user.id);

      if (!hasUserPermission) {
        return NextResponse.json(
          { error: "Only admin and paid members can edit blogs" },
          { status: 403 }
        );
      }
    }

    // Update the blog
    blog.title = title;
    blog.content = content;
    await blog.save();

    return NextResponse.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE a blog (admin and paid members only)
export async function DELETE(request) {
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

    // Get blog ID from URL
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("id");

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Find the blog
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if user is the author or an admin
    const isAuthor = blog.authorId.toString() === session.user.id;
    const isAdmin = (await User.findById(session.user.id))?.role === "admin";

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You can only delete your own blogs" },
        { status: 403 }
      );
    }

    // If not admin, check if user has permission
    if (!isAdmin) {
      const hasUserPermission = await hasPermission(session.user.id);

      if (!hasUserPermission) {
        return NextResponse.json(
          { error: "Only admin and paid members can delete blogs" },
          { status: 403 }
        );
      }
    }

    // Delete the blog
    await Blog.findByIdAndDelete(blogId);

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}

// PATCH share a blog (available to all users)
// export async function PATCH(request) {
//   try {
//     await connectDB();

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

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading blogs...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
        📰 Latest Blogs
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500 text-center">
          No blogs available right now. Check back later!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl hover:scale-[1.02] transition transform duration-200"
            >
              {/* Blog Title */}
              <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                {blog.title}
              </h2>

              {/* Description Preview */}
              <p className="text-gray-700 mt-3 text-sm line-clamp-3">
                {blog.content.split(" ").slice(0, 20).join(" ")}...
              </p>

              {/* Author + Date */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                <span>✍️ {blog.authorId?.name || "Anonymous"}</span>
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center mt-5">
                {/* Read More */}
                <Link
                  href={`/blogs/${blog._id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read More →
                </Link>

                {/* Share Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/blogs/${blog._id}`
                    );
                    alert("Blog link copied to clipboard!");
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  🔗 Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

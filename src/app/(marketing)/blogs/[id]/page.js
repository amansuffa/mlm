"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data.blog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading blog...</p>;
  }

  if (!blog) {
    return (
      <p className="text-center mt-10 text-red-600">
        ❌ Blog not found. It may have been deleted.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Blog Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
          {blog.title}
        </h1>

        {/* Meta Info */}
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span>✍️ {blog.authorId?.name || "Anonymous"}</span>
          <span>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Content */}
        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {blog.content}
        </p>

        {/* Share Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/blogs/${blog._id}`
              );
              alert("✅ Blog link copied!");
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition"
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}

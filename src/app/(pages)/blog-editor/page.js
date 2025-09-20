"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function BlogEditorPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
    const router = useRouter();
  

  // Fetch user's blogs
  async function fetchBlogs() {
    try {
      setLoading(true);
const res = await fetch("/api/blogs?my=true");
      const data = await res.json();

      if (data.blogs) setBlogs(data.blogs);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  }

  // Delete blog
  async function deleteBlog(blogId) {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`/api/blogs?id=${blogId}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        alert("Blog deleted successfully");
        fetchBlogs(); // refresh table
      } else {
        alert(data.error || "Failed to delete blog");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

   function handleEditBlog(blogId) {
    router.push(`blog-editor/${blogId}`);
  }
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Blogs</h1>
        <button
          onClick={() => (window.location.href = "/blog-editor/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create New Blog
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-600">No blogs found. Create one!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{blog.title}</td>
                  <td className="p-3 text-gray-600">
                    {blog.content.split(" ").slice(0, 4).join(" ")}...
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEditBlog(blog._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

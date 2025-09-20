"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // blog id from URL

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch blog");

        // ✅ Use data.blog here
        setBlog({
          title: data.blog?.title || "",
          content: data.blog?.content || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }
    if (id) fetchBlog();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update blog");

      router.push("/blog-editor");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Blog</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            value={blog.content}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded-md h-40"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}

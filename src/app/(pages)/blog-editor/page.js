"use client";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import ToastProvider from "@/components/ToastProvider";
import "@/Styling/style.scss";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BlogEditorPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { data: session } = useSession();

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    blogId: null,
    blogTitle: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch all blogs
  async function fetchBlogs() {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/blogs");
      if (data?.blogs) setBlogs(data.blogs);
    } catch (err) {
      console.error("Failed to fetch blogs:", err?.response || err);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  // Open delete confirmation modal
  function openDeleteModal(blogId, blogTitle) {
    setDeleteModal({
      isOpen: true,
      blogId,
      blogTitle,
    });
  }

  // Close delete modal
  function closeDeleteModal() {
    setDeleteModal({
      isOpen: false,
      blogId: null,
      blogTitle: "",
    });
  }

  // Delete blog
  async function deleteBlog() {
    if (!deleteModal.blogId) return;

    try {
      const res = await axios.delete(`/api/blogs?id=${deleteModal.blogId}`);

      if (res.status >= 200 && res.status < 300) {
        toast.success("Blog deleted successfully!", {
          className: "my-custom-toast",
        });
        fetchBlogs(); // refresh table
      } else {
        toast.error("❌ Failed to delete blog");
      }
    } catch (err) {
      console.error("Delete failed:", err?.response || err);
      toast.error("❌ Failed to delete blog");
    } finally {
      closeDeleteModal();
    }
  }

  function handleEditBlog(blogId) {
    router.push(`/blog-editor/${blogId}`);
  }

  function handleViewBlog(id) {
    const refId = session?.user?.username;
    if (refId) {
      router.push(`/blogs/${id}?ref=${refId}`);
    } else {
      router.push(`/blogs/${id}`);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Refetch blogs when refresh parameter changes
  useEffect(() => {
    const refreshParam = searchParams.get('refresh');
    if (refreshParam) {
      fetchBlogs();
      // Clean up URL without refresh param
      router.replace('/blog-editor');
    }
  }, [searchParams, router]);

  // Filter blogs based on search and category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    "business",
    "marketing",
    "success",
    "training",
    "news",
  ];

  return (
    <div className="min-h-screen py-8">
      {/* Delete Confirmation Modal */}
      <ToastProvider />
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteBlog}
        blogTitle={deleteModal.blogTitle}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div 
            className="header rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Blog Dashboard
                  </h1>
                  <p className="text-white text-opacity-90 text-lg">
                    Manage and create amazing content for your audience
                  </p>
                </div>
                <button
                  onClick={() => router.push("/blog-editor/create")}
                  className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                  style={{ color: 'var(--primary)' }}
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  <span>Create New Blog</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="rounded-xl" style={{border: `1px solid var(--border)`}}>
          <div 
            className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl"
            style={{ 
              backgroundColor: 'var(--card)',
              borderLeftColor: 'var(--primary)',
              borderColor: 'var(--primary)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Blogs</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                  {blogs.length}
                </p>
              </div>
              <div 
                className="p-3 rounded-lg bg-[var(--primary)]/20"
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: 'var(--primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
</div>
        </div>

        {/* Filters and Search */}
        <div 
          className="rounded-xl shadow-lg p-6 mb-6"
          style={{ 
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  className="card-secondary w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1"
                  style={{
                    '--tw-ring-color': 'var(--accent)'
                  }}
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5"
                  style={{ color: 'var(--primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="flex space-x-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                className="card-secondary rounded-xl px-4 py-3 focus:outline-none focus:ring-1"
                style={{
                  '--tw-ring-color': 'var(--accent)'
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div 
            className="card rounded-xl shadow-lg p-12 text-center"
          >
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p className="mt-4 text-lg opacity-80">Loading your blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div 
            className="rounded-xl shadow-lg p-12 text-center"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--primary)', opacity: '0.1' }}
            >
              <svg
                className="w-12 h-12"
                style={{ color: 'var(--primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              No blogs found
            </h3>
            <p className="mb-6 opacity-80">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first blog post"}
            </p>
            <button
              onClick={() => router.push("/blog-editor/create")}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              style={{ 
                background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                color: 'white'
              }}
            >
              <span>Create Your First Blog</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                style={{ border: `1px solid var(--border)` }}
              >
                {/* Blog Thumbnail */}
                <div 
                  className="h-48 relative overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                  }}
                >
                  {blog.thumbnail ? (
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      width={500}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-white opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="px-3 py-1 rounded-full text-xs bg-[var(--primary)]/20 text-[var(--primary)] font-semibold whitespace-nowrap transition-all duration-300"
                    >
                      {blog.category || "Uncategorized"}
                    </span>
                    <span className="text-sm opacity-70">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: 'var(--text)' }}>
                    {blog.title}
                  </h3>

                  <p className="text-sm mb-4 line-clamp-3 opacity-80 flex-1">
                    {blog.excerpt ? (
                      blog.excerpt
                    ) : (
                      <span className="italic opacity-60">
                        No excerpt provided.
                      </span>
                    )}
                  </p>

                  {/* Action Buttons */}
                  <div 
                    className="flex justify-center space-x-4 pt-4"
                    style={{ borderTop: `1px solid var(--border)` }}
                  >
                    <button
                      onClick={() => handleViewBlog(blog._id)}
                      className="p-2 hover:opacity-70 transition-opacity duration-200"
                      style={{ color: 'var(--text)' }}
                      title="View Blog"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditBlog(blog._id)}
                      className="p-2 hover:opacity-70 transition-opacity duration-200"
                      style={{ color: 'var(--accent)' }}
                      title="Edit Blog"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(blog._id, blog.title)}
                      className="p-2 hover:opacity-70 transition-opacity duration-200"
                      style={{ color: '#ef4444' }}
                      title="Delete Blog"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

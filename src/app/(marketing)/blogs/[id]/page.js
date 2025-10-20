"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import ToastProvider from "@/components/ToastProvider";
import "@/Styling/style.scss";

export default function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const searchParams = useSearchParams();

  const refId = searchParams.get("ref");

  // Helper: convert markdown image syntax and newlines to HTML
  const renderHTMLFromContent = (content) => {
    if (!content) return "No content available";
    let html = String(content);

    // Convert Markdown image syntax -> <img>
    html = html.replace(
      /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
      (match, alt, src) => {
        return `<img src="${src}" alt="${
          alt || "image"
        }" class="max-w-full rounded-lg my-4"/>`;
      }
    );

    // Convert Markdown video links -> <video>
    html = html.replace(
      /\[([^\]]*)\]\((https?:\/\/[^\s)]+\.mp4)\)/g,
      (match, text, src) => {
        return `
       <div class="flex justify-start my-6">
        <video controls class="h-60 w-60 rounded-xl shadow-lg">
          <source src="${src}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>`;
      }
    );

    // 🧾 Replace newlines with <br/>
    html = html.replace(/\n/g, "<br/>");

    return html;
  };

  // Generate affiliate link with user reference
  const generateAffiliateLink = () => {
    if (!refId) return null;
    return `${window.location.origin}/blogs/${blog._id}?ref=${refId}`;
  };

  // Handle Join button click
  const handleJoinClick = () => {
    const refId = searchParams.get("ref");
    if (refId) {
      window.location.href = `/signup?ref=${refId}`;
    } else {
      window.location.href = `/signup`;
    }
    setShowJoinModal(false);
  };

  // Copy affiliate link
  const copyAffiliateLink = () => {
    const link = generateAffiliateLink();
    if (!link) {
      toast.error("Affiliate link not found");
      return;
    }
    navigator.clipboard.writeText(link);
    toast.success("Affiliate link copied to clipboard!", {
      className: "my-custom-toast",
      toastId: "Affiliate link copied to clipboard!",
    });
    setShowJoinModal(false);
  };

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        const data = res.data;
        setBlog(data.blog);

        // Fetch related blogs based on category/tags
        if (data.blog.category || data.blog.tags?.length > 0) {
          fetchRelatedBlogs(data.blog);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    }

    async function fetchRelatedBlogs(currentBlog) {
      try {
        const queryParams = new URLSearchParams();
        if (currentBlog.category)
          queryParams.append("category", currentBlog.category);
        if (currentBlog.tags?.[0])
          queryParams.append("tag", currentBlog.tags[0]);
        queryParams.append("limit", "3");
        queryParams.append("exclude", currentBlog._id);

        const res = await axios.get(`/api/blogs?${queryParams}`);
        setRelatedBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch related blogs:", err);
      }
    }

    fetchBlog();
  }, [id]);

  const handleShare = async (platform) => {
    const url = `${window.location.origin}/blogs/${blog._id}?ref=${
      refId || ""
    }`;
    const title = blog.title;
    const text = blog.excerpt || blog.content?.substring(0, 100) + "...";

    try {
      switch (platform) {
        case "copy":
          await navigator.clipboard.writeText(url);
          toast.success("Blog link copied to clipboard!", {
            className: "my-custom-toast",
            toastId: "Blog link copied to clipboard!",
          });
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              title
            )}&url=${encodeURIComponent(url)}`,
            "_blank"
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          break;
        default:
          break;
      }
    } catch (err) {
      toast.error("Failed to share blog");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8200DB] mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Blog Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The blog you're looking for may have been deleted or doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#8200DB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6E11B0] transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      <ToastProvider />
      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Join Our Community
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Start your journey with us
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Ready to take the next step? Join our MLM community and start
                building your business today!
              </p>
              <div className="bg-[#8200DB] bg-opacity-10 border border-[#8200DB] border-opacity-20 rounded-lg p-4 mb-4">
                <p className="text-[#fff] text-sm font-semibold">
                  🎁 Special offer for blog readers!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={copyAffiliateLink}
                className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Copy Link
              </button>
              <button
                onClick={handleJoinClick}
                className="flex-1 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] text-white px-4 py-3 rounded-xl font-semibold hover:from-[#6E11B0] hover:to-[#8200DB] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#8200DB] to-[#6E11B0] py-16 lg:py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Right Join Button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-white text-[#8200DB] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                ></path>
              </svg>
              <span>Join Now</span>
            </button>
          </div>

          <div className="text-center text-white">
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-semibold">
                {blog.category || "Uncategorized"}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {blog.excerpt ? (
                blog.excerpt
              ) : (
                <span className="text-gray-400 italic">
                  No excerpt provided.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">
                    {blog.authorId?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  {blog.authorId?.name || "Anonymous"}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {blog.authorId?.username || "Author"}
                </p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Blog Creator</p>
                </div>
              </div>
            </div>

            {/* Blog Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">Blog Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Views</span>
                  <span className="font-semibold text-[#8200DB]">
                    {blog.views || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Likes</span>
                  <span className="font-semibold text-[#8200DB]">
                    {blog.likes || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Shares</span>
                  <span className="font-semibold text-[#8200DB]">
                    {blog.shares?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Widget */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">Share This Blog</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleShare("copy")}
                  className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg p-3 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="text-sm font-medium">Copy</span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 rounded-lg p-3 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                  <span className="text-sm font-medium text-white">Tweet</span>
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 rounded-lg p-3 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                  <span className="text-sm font-medium text-white">Share</span>
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 rounded-lg p-3 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                  <span className="text-sm font-medium text-white">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            {blog.thumbnail && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="relative h-80 lg:h-96">
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Blog Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span className="text-sm">
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span className="text-sm">5 min read</span>
                  </div>
                </div>

                {/* Tags */}
                {blog.tags?.length > 0 && blog.tags[0] && (
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#8200DB] bg-opacity-10 text-[#fff] px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Blog Content */}
              <article className="prose prose-lg max-w-none">
                <div
                  className="text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{
                    __html: renderHTMLFromContent(blog.content),
                  }}
                />
              </article>

              {/* Bottom Join Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-2xl p-8 text-center text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-blue-100 mb-6 text-lg">
                    Join our MLM community today and unlock your earning
                    potential. Start building your business with our proven
                    system.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={copyAffiliateLink}
                      className="bg-white text-[#8200DB] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                    >
                      Copy Affiliate Link
                    </button>
                    <button
                      onClick={handleJoinClick}
                      className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#8200DB] transition-all duration-300"
                    >
                      Join Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {blog.keywords?.length > 0 && blog.keywords[0] && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Related Blogs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <div
                      key={relatedBlog._id}
                      className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedBlog.excerpt ||
                          relatedBlog.content?.substring(0, 80) + "..."}
                      </p>
                      <button
                        onClick={() =>
                          (window.location.href = `/blogs/${relatedBlog._id}`)
                        }
                        className="text-[#8200DB] text-sm font-semibold mt-3 hover:text-[#6E11B0] transition-colors duration-200"
                      >
                        Read More →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

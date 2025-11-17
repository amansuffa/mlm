"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import ToastProvider from "@/components/ToastProvider";
import "@/Styling/style.scss";

export default function SingleBlogPage() {
  const { data: session } = useSession();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Comment section states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const searchParams = useSearchParams();
  const refId = searchParams.get("ref");

  // Fetch comments for this blog
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/blogs/${id}/comments`);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [id]);

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setCommentLoading(true);
    try {
      const response = await axios.post(`/api/blogs/${id}/comments`, {
        content: newComment.trim()
      });

      if (response.data.success) {
        setNewComment("");
        await fetchComments();
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // Add reply to comment
  const handleAddReply = async (parentId) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const response = await axios.post(`/api/blogs/${id}/comments`, {
        content: replyText.trim(),
        parentId: parentId
      });

      if (response.data.success) {
        setReplyText("");
        setReplyingTo(null);
        await fetchComments();
        toast.success("Reply added successfully!");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await axios.delete(`/api/blogs/${id}/comments/${commentId}`);
      
      if (response.data.success) {
        await fetchComments();
        toast.success("Comment deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  // Strip markdown syntax for clean text display
  const stripMarkdown = (content) => {
    if (!content) return "";
    return content
      .replace(/#{1,6}\s+/g, '') // Remove heading markers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/__([^_]+)__/g, '$1') // Remove bold
      .replace(/_([^_]+)_/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/^[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/^>\s+/gm, '') // Remove blockquotes
      .replace(/---/g, '') // Remove horizontal rules
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframes
      .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1') // Remove link tags but keep text
      .replace(/<[^>]*>/g, '') // Remove all other HTML tags
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
  };

  // Helper: convert markdown syntax to HTML
  const renderHTMLFromContent = (content) => {
    if (!content) return "No content available";
    let html = String(content);

    // Convert standard markdown headings # ## ### #### ##### ######
    html = html.replace(/^###### (.+)$/gm, '<h6 style="font-size: 0.875rem; font-weight: 600; margin: 0.75rem 0 0.25rem 0; color: var(--text);">$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5 style="font-size: 1rem; font-weight: 600; margin: 0.75rem 0 0.25rem 0; color: var(--text);">$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4 style="font-size: 1.125rem; font-weight: 600; margin: 1rem 0 0.5rem 0; color: var(--text);">$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem 0; color: var(--text);">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 style="font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 0.75rem 0; color: var(--text);">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 style="font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 1rem 0; color: var(--text);">$1</h1>');
    
    // Convert asterisk headings (*** = h1, ** = h2, * = h3)
    html = html.replace(/^\*\*\*\s*(.+)$/gm, '<h1 style="font-size: 1.875rem; font-weight: 700; margin: 1.5rem 0 1rem 0; color: var(--text);">$1</h1>');
    html = html.replace(/^\*\*\s*(.+)$/gm, '<h2 style="font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 0.75rem 0; color: var(--text);">$1</h2>');
    html = html.replace(/^\*\s*(.+)$/gm, '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem 0; color: var(--text);">$1</h3>');

    // Convert bold text **text** or __text__
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 700;">$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong style="font-weight: 700;">$1</strong>');

    // Convert italic text *text* or _text_
    html = html.replace(/\*([^*]+)\*/g, '<em style="font-style: italic;">$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em style="font-style: italic;">$1</em>');

    // Convert code blocks ```code```
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background-color: var(--cardSecondary); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; overflow-x: auto;"><code style="font-size: 0.875rem; font-family: monospace;">$1</code></pre>');

    // Convert inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code style="background-color: var(--cardSecondary); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: monospace;">$1</code>');

    // Convert Markdown image syntax -> <img> (process BEFORE links to avoid conflict)
    html = html.replace(
      /!\[([^\]]*)\]\(([^\s)]+)\)/g,
      (match, alt, src) => {
        return `<div style="margin: 1rem 0; text-align: center;"><img src="${src}" alt="${
          alt || "image"
        }" style="max-width: 100%; height: auto; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: inline-block;" loading="lazy"/></div>`;
      }
    );

    // Convert Markdown video links -> <video> (process BEFORE links to avoid conflict)
    html = html.replace(
      /\[([^\]]*)\]\(([^\s)]+\.(mp4|mov|avi|webm))\)/gi,
      (match, text, src) => {
        return `
       <div style="display: flex; justify-content: center; margin: 1.5rem 0;">
        <video controls style="max-width: 100%; height: auto; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <source src="${src}" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>`;
      }
    );

    // Convert links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: var(--primary); text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>');

    // Convert unordered lists - item
    html = html.replace(/^- (.+)$/gm, '<li style="margin-left: 1rem; margin-bottom: 0.25rem;">• $1</li>');
    html = html.replace(/(<li[^>]*>.*<\/li>)/s, '<ul style="margin: 1rem 0;">$1</ul>');

    // Convert ordered lists 1. item
    html = html.replace(/^\d+\. (.+)$/gm, '<li style="margin-left: 1rem; margin-bottom: 0.25rem;">$1</li>');
    html = html.replace(/(<li[^>]*>.*<\/li>)/s, '<ol style="margin: 1rem 0; list-style-type: decimal; padding-left: 1rem;">$1</ol>');

    // Convert blockquotes > text
    html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left: 4px solid var(--border); padding-left: 1rem; font-style: italic; opacity: 0.8; margin: 1rem 0;">$1</blockquote>');

    // Convert horizontal rules ---
    html = html.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid var(--border); margin: 1.5rem 0;">');





    // Handle line breaks properly - split by double newlines first
    const paragraphs = html.split(/\n\s*\n/);
    html = paragraphs.map(paragraph => {
      // Replace single newlines within paragraphs with <br/>
      const processedParagraph = paragraph.replace(/\n/g, '<br/>');
      
      // Don't wrap if already contains HTML tags
      if (processedParagraph.includes('<')) {
        return processedParagraph;
      }
      
      // Wrap plain text in paragraph tags
      return `<p style="margin: 1rem 0; color: var(--text);">${processedParagraph}</p>`;
    }).join('');

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

  // Handle Like functionality
  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/blogs/${id}/like`);
      
      if (response.data.success) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
        
        // Show toast message
        if (response.data.liked) {
          toast.success("❤️ Blog liked!", {
            className: "my-custom-toast",
          });
        } else {
          toast.info("💔 Like removed", {
            className: "my-custom-toast",
          });
        }
      }
    } catch (error) {
      console.error("Like error:", error);
      if (error.response?.status === 400) {
        toast.error("You have already liked this blog");
      } else {
        toast.error("Failed to like blog");
      }
    }
  };

  // Check if user has already liked the blog
  const checkLikeStatus = useCallback(async () => {
    try {
      const response = await axios.get(`/api/blogs/${id}/like`);
      
      if (response.data.success) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      console.error("Like status check error:", error);
    }
  }, [id]);

  // Share functionality
  const handleShare = async (platform) => {
    if (!blog) return;

    const url = `${window.location.origin}/blogs/${blog._id}${refId ? `?ref=${refId}` : ''}`;
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
          setShowShareModal(false);
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            "_blank"
          );
          setShowShareModal(false);
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            "_blank"
          );
          setShowShareModal(false);
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank"
          );
          setShowShareModal(false);
          break;
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
            "_blank"
          );
          setShowShareModal(false);
          break;
        case "telegram":
          window.open(
            `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            "_blank"
          );
          setShowShareModal(false);
          break;
        default:
          break;
      }
    } catch (err) {
      toast.error("Failed to share blog");
    }
  };

  // Open share modal
  const openShareModal = () => {
    setShowShareModal(true);
  };

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        const data = res.data;
        setBlog(data.blog);
        setLikesCount(data.blog.likes || 0);

        // Check like status after blog is loaded
        await checkLikeStatus();

        // Fetch comments
        await fetchComments();

        // Fetch related blogs based on category/tags
        if (data.blog.category || data.blog.tags?.length > 0) {
          fetchRelatedBlogs(data.blog);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog", {
          toastId: "Failed to load blog",
        });
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
        queryParams.append("limit", "4");
        queryParams.append("exclude", currentBlog._id);

        const res = await axios.get(`/api/blogs?${queryParams}`);
        setRelatedBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Failed to fetch related blogs:", err);
      }
    }

    fetchBlog();
  }, [id, checkLikeStatus, fetchComments]);

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
            The blog you&apos;re looking for may have been deleted or doesn&apos;t exist.
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
    <div className="min-h-screen pb-8" style={{ backgroundColor: 'var(--background)' }}>
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
                <p className="text-[#8200DB] text-sm font-semibold">
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

      {/* Share Modal */}
      {showShareModal && (
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
                      d="M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Share This Blog
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Spread the word with your network
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-6 text-center">
                Share this amazing blog with your friends and community
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Copy Link */}
                <button
                  onClick={() => handleShare("copy")}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-300 transition-colors">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Copy Link</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-600 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 group"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-700 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>

                {/* Twitter */}
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 group"
                >
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-500 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.543l-.047-.02z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Twitter</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 group"
                >
                  <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-800 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => handleShare("telegram")}
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 group"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-600 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Telegram</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div 
        className="relative py-16 lg:py-24"
        style={{ 
          background: `linear-gradient(135deg, var(--primary), var(--secondary))`
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Right Buttons */}
          <div className="absolute top-6 right-6 flex flex-col space-y-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 group"
              style={{ color: 'var(--primary)' }}
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
            <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed">
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
            <div 
              className="rounded-2xl shadow-lg p-6"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden text-2xl font-bold text-white overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                  }}
                >
                 {blog.authorId?.profilePicture ? (
                                         <Image
                                           src={blog.authorId.profilePicture}
                                           alt={blog.authorId.name || "Author"}
                                           width={48}
                                           height={48}
                                           className="w-full h-full object-cover"
                                         />
                                       ) : (
                                         blog.authorId?.name?.charAt(0) || "A"
                                       )}
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>
                  {blog.authorId?.name || "Anonymous"}
                </h3>
                <p className="text-sm mb-4 opacity-80">
                  {blog.authorId?.username || "Author"}
                </p>
                <div 
                  className="rounded-lg p-3"
                  style={{ backgroundColor: 'var(--cardSecondary)' }}
                >
                  <p className="text-xs opacity-70">Blog Creator</p>
                </div>
              </div>
            </div>

            {/* Blog Stats */}
            <div 
              className="rounded-2xl shadow-lg p-6"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <h4 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Blog Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Views</span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                    {blog.views || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Likes</span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                    {likesCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Shares</span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                    {blog.shares?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Comments</span>
                  <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                    {comments.length}
                  </span>
                </div>
              </div>

              {/* Like Button in Sidebar */}
              <button
                onClick={handleLike}
                className={`w-full mt-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group ${
                  isLiked
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "button text-white"
                }`}
              >
                <svg
                  className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                    isLiked ? "fill-current" : "fill-none"
                  }`}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{isLiked ? "Liked" : "Like this Blog"}</span>
              </button>
            </div>

            {/* Share Widget */}
            <div 
              className="rounded-2xl shadow-lg p-6"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <h4 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Quick Share</h4>
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
                  onClick={() => handleShare("whatsapp")}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 rounded-lg p-3 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485"/>
                  </svg>
                  <span className="text-sm font-medium text-white">WhatsApp</span>
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
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-medium text-white">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center justify-center space-x-2 bg-blue-400 hover:bg-blue-500 rounded-lg p-3 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.543l-.047-.02z"/>
                  </svg>
                  <span className="text-sm font-medium text-white">Twitter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            {blog.thumbnail && (
              <div 
                className="rounded-2xl shadow-lg overflow-hidden mb-8"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
              >
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
            <div 
              className="rounded-2xl shadow-lg p-8 mb-8"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              {/* Meta Information */}
              <div 
                className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6"
                style={{ borderBottom: `1px solid var(--border)` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 opacity-80">
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
                  <div className="flex items-center space-x-2 opacity-80">
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
                        className="px-3 py-1 rounded-full text-xs bg-[var(--primary)]/20 text-[var(--primary)] font-semibold whitespace-nowrap transition-all duration-300"
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
                  className="leading-relaxed text-lg"
                  style={{ color: 'var(--text)' }}
                  dangerouslySetInnerHTML={{
                    __html: renderHTMLFromContent(blog.content),
                  }}
                />
              </article>

              {/* Bottom Join Section */}
              <div className="mt-12 pt-8" style={{ borderTop: `1px solid var(--border)` }}>
                <div 
                  className="rounded-2xl p-8 text-center text-white"
                  style={{ 
                    background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                  }}
                >
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-white text-opacity-90 mb-6 text-lg">
                    Join our MLM community today and unlock your earning
                    potential. Start building your business with our proven
                    system.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={copyAffiliateLink}
                      className="bg-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                      style={{ color: 'var(--primary)' }}
                    >
                      Copy Affiliate Link
                    </button>
                    <button
                      onClick={handleJoinClick}
                      className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white transition-all duration-300"
                      onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                      onMouseLeave={(e) => e.target.style.color = 'white'}
                    >
                      Join Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {blog.keywords?.length > 0 && blog.keywords[0] && (
                <div className="mt-8 pt-6" style={{ borderTop: `1px solid var(--border)` }}>
                  <h4 className="font-bold mb-3" style={{ color: 'var(--text)' }}>Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {blog.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-lg text-sm"
                        style={{
                          backgroundColor: 'var(--cardSecondary)',
                          color: 'var(--text)'
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div 
              className="rounded-2xl shadow-lg p-8 mb-8"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Comments ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <div className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="card-secondary w-full px-4 py-3 rounded-xl focus:ring-1 resize-none"
                  style={{
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  rows="4"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleAddComment}
                    disabled={commentLoading || !newComment.trim()}
                    className="button text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-8 opacity-70">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div 
                      key={comment._id} 
                      className="pb-6 last:border-b-0"
                      style={{ 
                        borderBottom: `1px solid var(--border)`
                      }}
                    >
                      {/* Main Comment */}
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden text-xl font-bold text-white"
                            style={{ 
                              background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                            }}
                          >
                            
                                {comment.userId?.profilePicture ? (
                                         <Image
                                           src={comment.userId.profilePicture}
                                           alt={comment.userId.name || "Author"}
                                           width={48}
                                           height={48}
                                           className="w-full h-full object-cover"
                                         />
                                       ) : (
                                         comment.userId?.name?.charAt(0) || "U"
                                       )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div 
                            className="rounded-xl p-4"
                            style={{ backgroundColor: 'var(--cardSecondary)' }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>
                                {comment.userId?.name || "Anonymous"}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs opacity-70">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                                {/* Only show delete for comment author */}
                                {comment.userId?._id === session?.user?.id && (
                                  <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                            <p style={{ color: 'var(--text)' }}>{comment.content}</p>
                            <button
                              onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                              className="text-sm font-semibold mt-2 transition-colors duration-200"
                              style={{ color: 'var(--primary)' }}
                              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                              onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
                            >
                              {replyingTo === comment._id ? "Cancel" : "Reply"}
                            </button>
                          </div>

                          {/* Reply Form */}
                          {replyingTo === comment._id && (
                            <div className="ml-8 mt-4">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="card-secondary w-full px-4 py-2 rounded-lg focus:ring-1 resize-none"
                                style={{
                                  '--tw-ring-color': 'var(--accent)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                rows="3"
                              />
                              <div className="flex justify-end space-x-2 mt-2">
                                <button
                                  onClick={() => setReplyingTo(null)}
                                  className="px-4 py-2 transition-colors duration-200"
                                  style={{ color: 'var(--text)' }}
                                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                                > 
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleAddReply(comment._id)}
                                  disabled={!replyText.trim()}
                                  className="button text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 mt-4 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply._id} className="flex space-x-3">
                                  <div className="flex-shrink-0">
                                    <div 
                                      className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden text-lg font-bold text-white"
                                      style={{ backgroundColor: 'var(--primary)', opacity: '0.7' }}
                                    >
                                     
                                       {reply.userId?.profilePicture ? (
                                         <Image
                                           src={reply.userId.profilePicture}
                                           alt={reply.userId.name || "Author"}
                                           width={48}
                                           height={48}
                                           className="w-full h-full object-cover"
                                         />
                                       ) : (
                                         reply.userId?.name?.charAt(0) || "U"
                                       )}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div 
                                      className="rounded-lg p-3"
                                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <h5 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                                          {reply.userId?.name || "Anonymous"}
                                        </h5>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs opacity-70">
                                            {new Date(reply.createdAt).toLocaleDateString()}
                                          </span>
                                          {/* Only show delete for reply author */}
                                          {reply.userId?._id === session?.user?.id && (
                                            <button
                                              onClick={() => handleDeleteComment(reply._id)}
                                              className="text-red-500 hover:text-red-700 p-1"
                                            >
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                              </svg>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-sm" style={{ color: 'var(--text)' }}>{reply.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div 
                className="rounded-2xl shadow-lg p-8"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                  Related Blogs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.filter(relatedBlog => relatedBlog._id !== blog._id).map((relatedBlog) => (
                    <div
                      key={relatedBlog._id}
                      className="rounded-xl p-4 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                    >
                      <h4 className="font-semibold mb-2 line-clamp-2" style={{ color: 'var(--text)' }}>
                        {relatedBlog.title}
                      </h4>
                      <p className="text-sm line-clamp-2 opacity-80 flex-1 mb-3">
                        {stripMarkdown(relatedBlog.excerpt || relatedBlog.content)?.substring(0, 80)}...
                      </p>
                      <button
                        onClick={() =>
                          (window.location.href = `/blogs/${relatedBlog._id}`)
                        }
                        className="text-sm font-semibold mt-auto transition-colors duration-200"
                        style={{ color: 'var(--primary)' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
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
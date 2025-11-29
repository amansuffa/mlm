"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import ToastProvider from "@/components/ToastProvider";
import "@/Styling/style.scss";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

function AnimatedSection({ children, className = "" }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCard({ children, delay = 0 }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={scaleIn}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

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
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/^>\s+/gm, '')
      .replace(/---/g, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/\n+/g, ' ')
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <motion.p 
              className="text-lg opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Loading blog post...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <motion.div 
          className="text-center rounded-2xl shadow-lg p-8 max-w-md"
          style={{ backgroundColor: 'var(--card)' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--primary)', opacity: '0.1' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: 'var(--primary)' }}
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
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--text)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Blog Not Found
          </motion.h2>
          <motion.p 
            className="opacity-80 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            The blog you're looking for may have been deleted or doesn't exist.
          </motion.p>
          <motion.button
            onClick={() => window.history.back()}
            className="button px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <ToastProvider />
      
      {/* Join Modal */}
      {showJoinModal && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="rounded-2xl shadow-2xl max-w-md w-full"
            style={{ backgroundColor: 'var(--card)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                  }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
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
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                    Join Our Community
                  </h3>
                  <p className="opacity-70 text-sm">
                    Start your journey with us
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="opacity-90 mb-4">
                Ready to take the next step? Join our MLM community and start
                building your business today!
              </p>
              <div 
                className="rounded-lg p-4 mb-4 border"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  opacity: '0.1',
                  borderColor: 'var(--primary)',
                  opacity: '0.2'
                }}
              >
                <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>
                  🎁 Special offer for blog readers!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 p-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <motion.button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--cardSecondary)',
                  color: 'var(--text)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={copyAffiliateLink}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Copy Link
              </motion.button>
              <motion.button
                onClick={handleJoinClick}
                className="flex-1 button text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="rounded-2xl shadow-2xl max-w-md w-full"
            style={{ backgroundColor: 'var(--card)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                  }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
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
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                    Share This Blog
                  </h3>
                  <p className="opacity-70 text-sm">
                    Spread the word with your network
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="opacity-90 mb-6 text-center">
                Share this amazing blog with your friends and community
              </p>
              
              <motion.div 
                className="grid grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {[
                  { platform: "copy", label: "Copy Link", icon: "📋", color: "gray" },
                  { platform: "whatsapp", label: "WhatsApp", icon: "💚", color: "green" },
                  { platform: "facebook", label: "Facebook", icon: "📘", color: "blue" },
                  { platform: "twitter", label: "Twitter", icon: "🐦", color: "blue" },
                  { platform: "linkedin", label: "LinkedIn", icon: "💼", color: "blue" },
                  { platform: "telegram", label: "Telegram", icon: "📱", color: "blue" }
                ].map((item, index) => (
                  <motion.button
                    key={item.platform}
                    onClick={() => handleShare(item.platform)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 group"
                    style={{ backgroundColor: 'var(--cardSecondary)' }}
                    variants={scaleIn}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span 
                      className="text-2xl mb-2"
                      whileHover={{ scale: 1.2 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            {/* Modal Footer */}
            <div className="flex p-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <motion.button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--cardSecondary)',
                  color: 'var(--text)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section */}
      <motion.div 
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, var(--primary), var(--secondary))`
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 rounded-full"
            style={{ backgroundColor: 'var(--background)' }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-24 h-24 rounded-full"
            style={{ backgroundColor: 'var(--background)' }}
            animate={{
              scale: [1, 1.3, 1],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Right Buttons */}
          <motion.div 
            className="absolute top-6 right-6 flex flex-col space-y-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => setShowJoinModal(true)}
              className="bg-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 group"
              style={{ color: 'var(--primary)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ scale: 1.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                ></path>
              </motion.svg>
              <span>Join Now</span>
            </motion.button>
          </motion.div>

          <div className="text-center text-white">
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-semibold">
                {blog.category || "Uncategorized"}
              </span>
            </motion.div>
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {blog.title}
            </motion.h1>
            <motion.p 
              className="text-xl text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {blog.excerpt ? (
                blog.excerpt
              ) : (
                <span className="text-gray-300 italic">
                  No excerpt provided.
                </span>
              )}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Card */}
            <AnimatedCard>
              <motion.div 
                className="rounded-2xl shadow-lg p-6"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  <motion.div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden text-2xl font-bold text-white shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                    }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {blog.authorId?.profilePicture ? (
                      <Image
                        src={blog.authorId.profilePicture}
                        alt={blog.authorId.name || "Author"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      blog.authorId?.name?.charAt(0) || "A"
                    )}
                  </motion.div>
                  <motion.h3 
                    className="font-bold text-lg mb-1"
                    style={{ color: 'var(--text)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {blog.authorId?.name || "Anonymous"}
                  </motion.h3>
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
              </motion.div>
            </AnimatedCard>

            {/* Blog Stats */}
            <AnimatedCard delay={0.1}>
              <motion.div 
                className="rounded-2xl shadow-lg p-6"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
                whileHover={{ y: -5 }}
              >
                <h4 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Blog Stats</h4>
                <div className="space-y-3">
                  {[
                    { label: "Views", value: blog.views || 0 },
                    { label: "Likes", value: likesCount },
                    { label: "Shares", value: blog.shares?.length || 0 },
                    { label: "Comments", value: comments.length }
                  ].map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <span className="text-sm opacity-80">{stat.label}</span>
                      <motion.span 
                        className="font-semibold"
                        style={{ color: 'var(--primary)' }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {stat.value}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>

                {/* Like Button in Sidebar */}
                <motion.button
                  onClick={handleLike}
                  className={`w-full mt-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group ${
                    isLiked
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "button text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.svg
                    className={`w-5 h-5 ${
                      isLiked ? "fill-current" : "fill-none"
                    }`}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </motion.svg>
                  <span>{isLiked ? "Liked" : "Like this Blog"}</span>
                </motion.button>
              </motion.div>
            </AnimatedCard>

            {/* Share Widget */}
            <AnimatedCard delay={0.2}>
              <motion.div 
                className="rounded-2xl shadow-lg p-6"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
                whileHover={{ y: -5 }}
              >
                <h4 className="font-bold mb-4" style={{ color: 'var(--text)' }}>Quick Share</h4>
                <motion.div 
                  className="grid grid-cols-2 gap-2"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {[
                    { platform: "copy", icon: "📋", label: "Copy" },
                    { platform: "whatsapp", icon: "💚", label: "WhatsApp" },
                    { platform: "facebook", icon: "📘", label: "Facebook" },
                    { platform: "twitter", icon: "🐦", label: "Twitter" }
                  ].map((item, index) => (
                    <motion.button
                      key={item.platform}
                      onClick={() => handleShare(item.platform)}
                      className="flex items-center justify-center space-x-2 rounded-lg p-3 transition-all duration-300 group"
                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                      variants={scaleIn}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <motion.span
                        whileHover={{ scale: 1.2 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatedCard>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            {blog.thumbnail && (
              <AnimatedSection>
                <motion.div 
                  className="rounded-2xl shadow-lg overflow-hidden mb-8"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: `1px solid var(--border)`
                  }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="relative h-80 lg:h-96 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </AnimatedSection>
            )}

            {/* Blog Content */}
            <AnimatedSection>
              <motion.div 
                className="rounded-2xl shadow-lg p-8 mb-8"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
                whileHover={{ y: -5 }}
              >
                {/* Meta Information */}
                <motion.div 
                  className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6"
                  style={{ borderBottom: `1px solid var(--border)` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 rounded-full text-xs bg-[var(--primary)]/20 text-[var(--primary)] font-semibold whitespace-nowrap transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* Blog Content */}
                <motion.article 
                  className="prose prose-lg max-w-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div
                    className="leading-relaxed text-lg"
                    style={{ color: 'var(--text)' }}
                    dangerouslySetInnerHTML={{
                      __html: renderHTMLFromContent(blog.content),
                    }}
                  />
                </motion.article>

                {/* Bottom Join Section */}
                <motion.div 
                  className="mt-12 pt-8"
                  style={{ borderTop: `1px solid var(--border)` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div 
                    className="rounded-2xl p-8 text-center text-white"
                    style={{ 
                      background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                    }}
                    whileHover={{ scale: 1.02 }}
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
                      <motion.button
                        onClick={copyAffiliateLink}
                        className="bg-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                        style={{ color: 'var(--primary)' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Copy Affiliate Link
                      </motion.button>
                      <motion.button
                        onClick={handleJoinClick}
                        className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white transition-all duration-300"
                        style={{ color: 'white' }}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: 'white',
                          color: 'var(--primary)'
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Join Now
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Keywords */}
                {blog.keywords?.length > 0 && blog.keywords[0] && (
                  <motion.div 
                    className="mt-8 pt-6"
                    style={{ borderTop: `1px solid var(--border)` }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h4 className="font-bold mb-3" style={{ color: 'var(--text)' }}>Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {blog.keywords.map((keyword, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 rounded-lg text-sm"
                          style={{
                            backgroundColor: 'var(--cardSecondary)',
                            color: 'var(--text)'
                          }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatedSection>

            {/* Comments Section */}
            <AnimatedSection>
              <motion.div 
                className="rounded-2xl shadow-lg p-8 mb-8"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                  Comments ({comments.length})
                </h3>

                {/* Add Comment Form */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.textarea
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
                    whileFocus={{ scale: 1.02 }}
                  />
                  <div className="flex justify-end mt-3">
                    <motion.button
                      onClick={handleAddComment}
                      disabled={commentLoading || !newComment.trim()}
                      className="button text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: commentLoading || !newComment.trim() ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {commentLoading ? "Posting..." : "Post Comment"}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Comments List */}
                <motion.div 
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {comments.length === 0 ? (
                    <motion.div 
                      className="text-center py-8 opacity-70"
                      variants={fadeInUp}
                    >
                      <motion.svg
                        className="w-12 h-12 mx-auto mb-3 opacity-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </motion.svg>
                      <p>No comments yet. Be the first to comment!</p>
                    </motion.div>
                  ) : (
                    comments.map((comment) => (
                      <motion.div
                        key={comment._id}
                        variants={fadeInUp}
                        className="pb-6 last:border-b-0"
                        style={{ 
                          borderBottom: `1px solid var(--border)`
                        }}
                      >
                        {/* Main Comment */}
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <motion.div 
                              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden text-xl font-bold text-white shadow-lg"
                              style={{ 
                                background: `linear-gradient(135deg, var(--primary), var(--secondary))`
                              }}
                              whileHover={{ scale: 1.1 }}
                            >
                              {comment.userId?.profilePicture ? (
                                <Image
                                  src={comment.userId.profilePicture}
                                  alt={comment.userId.name || "Author"}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                comment.userId?.name?.charAt(0) || "U"
                              )}
                            </motion.div>
                          </div>
                          <div className="flex-1">
                            <motion.div 
                              className="rounded-xl p-4"
                              style={{ backgroundColor: 'var(--cardSecondary)' }}
                              whileHover={{ scale: 1.01 }}
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
                                    <motion.button
                                      onClick={() => handleDeleteComment(comment._id)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                      whileHover={{ scale: 1.2 }}
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                      </svg>
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                              <p style={{ color: 'var(--text)' }}>{comment.content}</p>
                              <motion.button
                                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                className="text-sm font-semibold mt-2 transition-colors duration-200"
                                style={{ color: 'var(--primary)' }}
                                whileHover={{ scale: 1.05 }}
                              >
                                {replyingTo === comment._id ? "Cancel" : "Reply"}
                              </motion.button>
                            </motion.div>

                            {/* Reply Form */}
                            {replyingTo === comment._id && (
                              <motion.div 
                                className="ml-8 mt-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <motion.textarea
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
                                  whileFocus={{ scale: 1.02 }}
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                  <motion.button
                                    onClick={() => setReplyingTo(null)}
                                    className="px-4 py-2 transition-colors duration-200"
                                    style={{ color: 'var(--text)' }}
                                    whileHover={{ scale: 1.05 }}
                                  > 
                                    Cancel
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleAddReply(comment._id)}
                                    disabled={!replyText.trim()}
                                    className="button text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: !replyText.trim() ? 1 : 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Post Reply
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <motion.div 
                                className="ml-8 mt-4 space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                {comment.replies.map((reply) => (
                                  <motion.div 
                                    key={reply._id} 
                                    className="flex space-x-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                  >
                                    <div className="flex-shrink-0">
                                      <motion.div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden text-lg font-bold text-white shadow-lg"
                                        style={{ backgroundColor: 'var(--primary)', opacity: '0.7' }}
                                        whileHover={{ scale: 1.1 }}
                                      >
                                        {reply.userId?.profilePicture ? (
                                          <Image
                                            src={reply.userId.profilePicture}
                                            alt={reply.userId.name || "Author"}
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          reply.userId?.name?.charAt(0) || "U"
                                        )}
                                      </motion.div>
                                    </div>
                                    <div className="flex-1">
                                      <motion.div 
                                        className="rounded-lg p-3"
                                        style={{ backgroundColor: 'var(--cardSecondary)' }}
                                        whileHover={{ scale: 1.01 }}
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
                                              <motion.button
                                                onClick={() => handleDeleteComment(reply._id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                whileHover={{ scale: 1.2 }}
                                              >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                              </motion.button>
                                            )}
                                          </div>
                                        </div>
                                        <p className="text-sm" style={{ color: 'var(--text)' }}>{reply.content}</p>
                                      </motion.div>
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </motion.div>
            </AnimatedSection>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <AnimatedSection>
                <motion.div 
                  className="rounded-2xl shadow-lg p-8"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: `1px solid var(--border)`
                  }}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                    Related Blogs
                  </h3>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {relatedBlogs.filter(relatedBlog => relatedBlog._id !== blog._id).map((relatedBlog, index) => (
                      <AnimatedCard key={relatedBlog._id} delay={index * 0.1}>
                        <motion.div
                          className="rounded-xl p-4 hover:shadow-md transition-shadow duration-300 flex flex-col h-full cursor-pointer"
                          style={{ backgroundColor: 'var(--cardSecondary)' }}
                          whileHover={{ y: -5, scale: 1.02 }}
                          onClick={() => window.location.href = `/blogs/${relatedBlog._id}`}
                        >
                          <h4 className="font-semibold mb-2 line-clamp-2" style={{ color: 'var(--text)' }}>
                            {relatedBlog.title}
                          </h4>
                          <p className="text-sm line-clamp-2 opacity-80 flex-1 mb-3">
                            {stripMarkdown(relatedBlog.excerpt || relatedBlog.content)?.substring(0, 80)}...
                          </p>
                          <motion.button
                            className="text-sm font-semibold mt-auto transition-colors duration-200 flex items-center space-x-1"
                            style={{ color: 'var(--primary)' }}
                            whileHover={{ x: 5 }}
                          >
                            <span>Read More</span>
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              →
                            </motion.span>
                          </motion.button>
                        </motion.div>
                      </AnimatedCard>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
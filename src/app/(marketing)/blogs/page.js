"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const { data: session } = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/blogs");
        const data = await res.json();
        const blogsData = data.blogs || [];
        setBlogs(blogsData);
        
        // Set the first blog as featured
        if (blogsData.length > 0) {
          setFeaturedBlog(blogsData[0]);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Enhanced input handlers with focus effects
  const handleInputFocus = (e) => {
    e.target.style.borderColor = 'var(--accent)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.authorId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
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

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p className="mt-4 text-lg opacity-80">Loading articles...</p>
        
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="header rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="px-8 py-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Our Blog
              </h1>
              <p className="text-white text-opacity-90 text-xl max-w-2xl mx-auto">
                Discover insights, stories, and expert perspectives from our community
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 transition-all duration-300 text-lg shadow-lg"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `2px solid var(--border)`,
                  color: 'var(--text)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
              <svg
                className="absolute right-6 top-4 w-5 h-5"
                style={{ color: 'var(--primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Featured Article */}
        {featuredBlog && !searchTerm && (
          <div className="mb-16">
            <div 
              className="rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              {/* Featured Blog Thumbnail */}
              {featuredBlog.thumbnail && (
                <div className="relative h-64 lg:h-80 w-full">
                  <Image
                    src={featuredBlog.thumbnail}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <span 
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ 
                      backgroundColor: 'var(--primary)',
                      color: 'white'
                    }}
                  >
                    Featured Article
                  </span>
                  <div className="ml-4 flex items-center space-x-4 text-sm opacity-70">
                    <span>{new Date(featuredBlog.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{getReadingTime(featuredBlog.content)} min read</span>
                  </div>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                  {featuredBlog.title}
                </h2>
                
                <p className="text-lg opacity-80 mb-8 leading-relaxed">
                  {stripMarkdown(featuredBlog.content).split(" ").slice(0, 50).join(" ")}...
                </p>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-semibold text-white" style={{ backgroundColor: 'var(--primary)' }}>
                      {featuredBlog.authorId?.profilePicture ? (
                        <Image
                          src={featuredBlog.authorId.profilePicture}
                          alt={featuredBlog.authorId.name || "Author"}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        featuredBlog.authorId?.name?.charAt(0) || "A"
                      )}
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text)' }}>
                        {featuredBlog.authorId?.name || "Anonymous"}
                      </p>
                      <p className="text-sm opacity-70">Author</p>
                    </div>
                  </div>
                  
                  <Link
                    href={`/blogs/${featuredBlog._id}?ref=${session?.user?.username || ""}`}
                    className="button px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl flex items-center space-x-2 group"
                  >
                    <span>Read Full Article</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <div 
            className="rounded-2xl shadow-lg p-16 text-center"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--primary)', opacity: '0.1' }}
            >
              <svg
                className="w-12 h-12"
                style={{ color: 'var(--primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 5h6m-6 3h6m-6 3h6" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
              {searchTerm ? "No articles found" : "No articles published yet"}
            </h3>
            <p className="text-lg opacity-80 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms or browse all articles" 
                : "Stay tuned for exciting content coming soon!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="button px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                View All Articles
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Section Title */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text)' }}>
                {searchTerm ? "Search Results" : "Latest Articles"}
              </h2>
              <p className="opacity-70">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(searchTerm ? filteredBlogs : filteredBlogs.filter(blog => blog._id !== featuredBlog?._id)).map((blog) => (
                <article
                  key={blog._id}
                  className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:translate-y-[-8px] transition-all duration-500 group flex flex-col h-full"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: `1px solid var(--border)`
                  }}
                >
                  {/* Blog Thumbnail */}
                  {blog.thumbnail ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={blog.thumbnail}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="h-48 w-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                    >
                      <svg
                        className="w-12 h-12 opacity-30"
                        style={{ color: 'var(--primary)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Article Meta */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-sm opacity-70">
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{getReadingTime(blog.content)} min read</span>
                      </div>
                    </div>

                    {/* Article Title - Below Image */}
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:opacity-80 transition-opacity" style={{ color: 'var(--text)' }}>
                      {blog.title}
                    </h3>
                    
                    {/* Article Excerpt */}
                    <p className="opacity-80 mb-4 line-clamp-3 leading-relaxed text-sm flex-1">
                      {stripMarkdown(blog.content).split(" ").slice(0, 25).join(" ")}...
                    </p>

                    {/* Author and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t mt-auto" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white overflow-hidden"
                          style={{ backgroundColor: 'var(--primary)' }}
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
                        <span className="text-sm opacity-80">{blog.authorId?.name || "Anonymous"}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/blogs/${blog._id}?ref=${session?.user?.username || ""}`}
                          className="text-sm font-semibold transition-all duration-300 hover:opacity-70"
                          style={{ color: 'var(--primary)' }}
                        >
                          Read
                        </Link>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/blogs/${blog._id}?ref=${session?.user?.username || ""}`
                            );
                            // You can replace this with toast
                            alert("Article link copied to clipboard!");
                          }}
                          className="p-1 transition-all duration-200 hover:opacity-70 opacity-60"
                          style={{ color: 'var(--text)' }}
                          title="Share article"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Section */}
        {/* <div className="mt-20">
          <div 
            className="rounded-2xl shadow-xl overflow-hidden"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div className="px-8 py-12 text-center">
              <div 
                className="w-20 h-20 rounded-2xl bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-6"
              >
                <svg
                  className="w-10 h-10 text-[var(--primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Stay in the Loop
              </h3>
              <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                Get the latest articles, insights, and updates delivered directly to your inbox
              </p>
              <div className="flex max-w-md mx-auto space-x-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="flex-1 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300"
                  style={{ 
                    backgroundColor: 'var(--cardSecondary)',
                    border: `2px solid var(--border)`,
                    color: 'var(--text)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                />
                <button className="button px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
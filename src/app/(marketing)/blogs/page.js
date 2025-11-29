"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
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

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              Loading articles...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
       <section 
        className="relative py-20 text-center overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
        }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white opacity-10"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-white opacity-10"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-12 h-12 rounded-full bg-white opacity-10"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The official <span className="text-yellow-300">PASH</span>.CLUB Blog
     
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white opacity-90 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover insights, strategies & success stories to help you build freedom, success and stability
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-20 h-1 bg-yellow-300 mx-auto rounded-full"
          />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="py-20 text-center">
    

          {/* Search Bar */}
          <AnimatedSection>
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="relative">
                <motion.input
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
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.svg
                  className="absolute right-6 top-4 w-5 h-5"
                  style={{ color: 'var(--primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: searchTerm ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </motion.svg>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
        

        {/* Featured Article */}
        {featuredBlog && !searchTerm && (
          <AnimatedSection>
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
                whileHover={{ y: -5 }}
              >
                {/* Featured Blog Thumbnail */}
                {featuredBlog.thumbnail && (
                  <motion.div 
                    className="relative h-64 lg:h-80 w-full overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link target="_blank"
href={`/blogs/${featuredBlog._id}?ref=${session?.user?.username || ""}`}>
                    <Image
                      src={featuredBlog.thumbnail}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </Link>
                  </motion.div>
                )}
                
                <div className="p-8 lg:p-12">
                  <motion.div 
                    className="flex items-center mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.span 
                      className="px-4 py-2 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'white'
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      Featured Article
                    </motion.span>
                    <div className="ml-4 flex items-center space-x-4 text-sm opacity-70">
                      <span>{new Date(featuredBlog.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{getReadingTime(featuredBlog.content)} min read</span>
                    </div>
                  </motion.div>
<Link target="_blank"
href={`/blogs/${featuredBlog._id}?ref=${session?.user?.username || ""}`}>
                  <motion.h2 
                    className="text-3xl lg:text-4xl font-bold mb-6 group-hover:opacity-90 transition-opacity"
                    style={{ color: 'var(--text)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {featuredBlog.title}
                  </motion.h2>
                  </Link>
                  
                  <motion.p 
                    className="text-lg opacity-80 mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {stripMarkdown(featuredBlog.content).split(" ").slice(0, 50).join(" ")}...
                  </motion.p>

                  <motion.div 
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-semibold text-white shadow-lg"
                        style={{ backgroundColor: 'var(--primary)' }}
                        whileHover={{ scale: 1.1 }}
                      >
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
                      </motion.div>
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--text)' }}>
                          {featuredBlog.authorId?.name || "Anonymous"}
                        </p>
                        <p className="text-sm opacity-70">Author</p>
                      </div>
                    </div>
                    
                    <Link target="_blank"
                      href={`/blogs/${featuredBlog._id}?ref=${session?.user?.username || ""}`}
                      className="button px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl flex items-center space-x-2 group"
                    >
                      <span>Read Full Article</span>
                      <motion.svg 
                        className="w-5 h-5"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        )}

        {/* Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <AnimatedSection>
            <motion.div 
              className="rounded-2xl shadow-lg p-16 text-center"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="w-24 h-24 rounded-full flex items-center bg-[var(--primary)]/10 justify-center mx-auto mb-6"
           
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <motion.svg
                  className="w-12 h-12"
                  style={{ color: 'var(--primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12m0-12a2 2 0 012-2h2a2 2 0 012 2m-6 5h6m-6 3h6m-6 3h6" />
                </motion.svg>
              </motion.div>
              <motion.h3 
                className="text-2xl font-semibold mb-4"
                style={{ color: 'var(--text)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {searchTerm ? "No articles found" : "No articles published yet"}
              </motion.h3>
              <motion.p 
                className="text-lg opacity-80 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {searchTerm 
                  ? "Try adjusting your search terms or browse all articles" 
                  : "Stay tuned for exciting content coming soon!"}
              </motion.p>
              {searchTerm && (
                <motion.button
                  onClick={() => setSearchTerm("")}
                  className="button px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Articles
                </motion.button>
              )}
            </motion.div>
          </AnimatedSection>
        ) : (
          <div>
            {/* Section Title */}
            <AnimatedSection>
              <motion.div 
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h2 
                  className="text-2xl lg:text-3xl font-bold"
                  style={{ color: 'var(--text)' }}
                  whileHover={{ scale: 1.02 }}
                >
                  {searchTerm ? "Search Results" : "Latest Articles"}
                </motion.h2>
                <motion.p 
                  className="opacity-70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.3 }}
                >
                  {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
                </motion.p>
              </motion.div>
            </AnimatedSection>

            {/* Articles Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {(searchTerm ? filteredBlogs : filteredBlogs.filter(blog => blog._id !== featuredBlog?._id)).map((blog, index) => (
                <AnimatedCard key={blog._id} delay={index * 0.1}>
                  <motion.article
                    className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl group flex flex-col h-full cursor-pointer"
                    style={{ 
                      backgroundColor: 'var(--card)',
                      border: `1px solid var(--border)`
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                 
                  >
                    <Link target="_blank"
                      href={`/blogs/${blog._id}?ref=${session?.user?.username || ""}`}
                  
                    >
                     
                  
                    {/* Blog Thumbnail */}
                    {blog.thumbnail ? (
                      <motion.div 
                        className="relative h-48 w-full overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="h-48 w-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)' }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.svg
                          className="w-12 h-12 opacity-30"
                          style={{ color: 'var(--primary)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </motion.svg>
                      </motion.div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      {/* Article Meta */}
                      <motion.div 
                        className="flex items-center justify-between mb-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center space-x-2 text-sm opacity-70">
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{getReadingTime(blog.content)} min read</span>
                        </div>
                      </motion.div>

                      {/* Article Title */}
                      <motion.h3 
                        className="text-xl font-bold mb-3 line-clamp-2 group-hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--text)' }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {blog.title}
                      </motion.h3>
                      
                      {/* Article Excerpt */}
                      <motion.p 
                        className="opacity-80 mb-4 line-clamp-3 leading-relaxed text-sm flex-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.8 }}
                        transition={{ delay: 0.3 }}
                      >
                        {stripMarkdown(blog.content).split(" ").slice(0, 25).join(" ")}...
                      </motion.p>

                      {/* Author and Actions */}
                      <motion.div 
                        className="flex items-center justify-between pt-4 border-t mt-auto"
                        style={{ borderColor: 'var(--border)' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white overflow-hidden shadow-lg"
                            style={{ backgroundColor: 'var(--primary)' }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {blog.authorId?.profilePicture ? (
                              <Image
                                src={blog.authorId.profilePicture}
                                alt={blog.authorId.name || "Author"}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              blog.authorId?.name?.charAt(0) || "A"
                            )}
                          </motion.div>
                          <span className="text-sm opacity-80">{blog.authorId?.name || "Anonymous"}</span>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="text-sm font-semibold transition-all duration-300 hover:opacity-70"
                            style={{ color: 'var(--primary)' }}
                            whileHover={{ scale: 1.05 }}
                          >
                            Read →
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                      </Link>
                  </motion.article>
                </AnimatedCard>
              ))}
            </motion.div>
          </div>
        )}

        {/* Newsletter Section */}
        {!searchTerm && (
          <AnimatedSection>
            <motion.div 
              className="mt-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="rounded-2xl shadow-xl overflow-hidden relative"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
                whileHover={{ y: -5 }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-5">
                  <motion.div
                    className="absolute top-4 left-4 w-8 h-8 rounded-full"
                    style={{ backgroundColor: 'var(--primary)' }}
                    animate={{
                      scale: [1, 1.5, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full"
                    style={{ backgroundColor: 'var(--secondary)' }}
                    animate={{
                      scale: [1, 1.3, 1],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  />
                </div>

                <div className="px-8 py-12 text-center relative z-10">
                  <motion.div 
                    className="w-20 h-20 rounded-2xl bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.svg
                      className="w-10 h-10 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </motion.svg>
                  </motion.div>
                  <motion.h3 
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'var(--text)' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Stay in the Loop
                  </motion.h3>
                  <motion.p 
                    className="text-lg opacity-80 mb-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Get the latest articles, insights, and updates delivered directly to your inbox
                  </motion.p>
                  <motion.div 
                    className="flex max-w-md mx-auto space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.input
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
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.button 
                      className="button px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg whitespace-nowrap"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Subscribe
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
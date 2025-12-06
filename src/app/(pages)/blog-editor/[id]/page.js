"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [videoLinks, setVideoLinks] = useState([""]);

  // Fetch blog data
  useEffect(() => {
    async function fetchBlog() {
      try {
        setFetchLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch blog");

        const blogData = data.blog;

        // Set all fields
        setTitle(blogData.title || "");
        setContent(blogData.content || "");
        setExcerpt(blogData.excerpt || "");
        setTags(blogData.tags?.join(", ") || "");
        setKeywords(blogData.keywords?.join(", ") || "");
        setCategory(blogData.category || "");
        setThumbnailPreview(blogData.thumbnail || "");
        setVideoLinks(blogData.videoLinks || [""]);
        
        // Extract existing images from content
        if (blogData.images && blogData.images.length > 0) {
          const existingImages = blogData.images.map((imageUrl, index) => ({
            preview: imageUrl,
            name: `existing-image-${index + 1}`,
            isExisting: true
          }));
          setUploadedImages(existingImages);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        toast.error("Failed to load blog");
      } finally {
        setFetchLoading(false);
      }
    }

    if (id) fetchBlog();
  }, [id]);

  // Thumbnail upload handler
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  // Video upload handler
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map((file) => ({
      file,
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
    }));
    setUploadedVideos((prev) => [...prev, ...newVideos]);
  };

  // Video links handlers
  const addVideoLink = () => {
    setVideoLinks((prev) => [...prev, ""]);
  };

  const updateVideoLink = (index, value) => {
    const newLinks = [...videoLinks];
    newLinks[index] = value;
    setVideoLinks(newLinks);
  };

  const removeVideoLink = (index) => {
    setVideoLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove image
  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove video
  const removeVideo = (index) => {
    setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // Insert media into editor
  const insertImageToEditor = (imageUrl) => {
    const markdownImage = `![Image](${imageUrl})`;
    setContent((prev) => prev + `\n${markdownImage}\n`);
  };

  const insertVideoToEditor = (videoUrl) => {
    const markdownVideo = `[Video](${videoUrl})`;
    setContent((prev) => prev + `\n${markdownVideo}\n`);
  };

  // Upload helper for single files
  const uploadFileToServer = async (file, folder = "blog-videos") => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await axios.post("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      return res.data?.url;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  };

  // Replace blob URLs in content by uploading matching local files and replacing with HTTPS URLs
  const replaceBlobUrlsInContent = async (rawContent) => {
    if (!rawContent) return rawContent;
    let updated = String(rawContent);
    const blobUrls = [...new Set(updated.match(/blob:[^\s)"']+/g) || [])];

    for (const blobUrl of blobUrls) {
      const vid = uploadedVideos.find((v) => v.preview === blobUrl);
      const img = uploadedImages.find((i) => i.preview === blobUrl);

      const fileObj = vid?.file || img?.file;
      if (!fileObj) continue;

      try {
        const uploadedUrl = await uploadFileToServer(
          fileObj,
          vid ? "blog-videos" : "blog-images"
        );
        if (uploadedUrl) {
          updated = updated.split(blobUrl).join(uploadedUrl);
        }
      } catch (err) {
        console.error("Failed to upload blob URL:", blobUrl, err);
      }
    }

    return updated;
  };

  const insertVideoLinkToEditor = (videoUrl) => {
    if (videoUrl.includes("youtube") || videoUrl.includes("youtu.be")) {
      const videoId = videoUrl.includes("youtube.com")
        ? videoUrl.split("v=")[1]?.split("&")[0]
        : videoUrl.split("youtu.be/")[1];
      const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      setContent((prev) => prev + `\n${embedCode}\n`);
    } else if (videoUrl.includes("vimeo")) {
      const videoId = videoUrl.split("vimeo.com/")[1];
      const embedCode = `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      setContent((prev) => prev + `\n${embedCode}\n`);
    } else {
      const markdownLink = `[Video Link](${videoUrl})`;
      setContent((prev) => prev + `\n${markdownLink}\n`);
    }
  };

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const contentToSubmit = await replaceBlobUrlsInContent(content);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", contentToSubmit);
      formData.append("excerpt", excerpt);
      formData.append("tags", tags);
      formData.append("keywords", keywords);
      formData.append("category", category);

      // Add video links
      videoLinks.forEach((link, index) => {
        if (link.trim()) {
          formData.append(`videoLinks[${index}]`, link);
        }
      });

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      // Append images (only new ones with file objects)
      uploadedImages.forEach((image, index) => {
        if (image.file) {
          formData.append(`images`, image.file);
        }
      });

      // Append videos
      uploadedVideos.forEach((video, index) => {
        formData.append(`videos`, video.file);
      });

      const response = await axios.put(`/api/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      toast.success("🎉 Blog updated successfully!");

      setTimeout(() => {
        router.push("/blog-editor?refresh=" + Date.now());
      }, 1500);
    } catch (err) {
      console.error("Update error:", err);
      const errorMsg = err.response?.data?.error || "Failed to update blog";
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto"
            style={{ borderColor: 'var(--primary)' }}
          ></div>
          <p className="mt-4 text-lg opacity-80">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div 
            className="rounded-2xl shadow-xl overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, var(--primary), var(--secondary))`
            }}
          >
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Edit Blog Post
                  </h1>
                  <p className="text-white text-opacity-90 text-lg">
                    Update and refine your content
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-white text-sm font-medium">
                    Blog Editor
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div 
            className="rounded-xl p-4 mb-6"
            style={{
              backgroundColor: 'var(--error)',
              opacity: '0.1',
              border: `1px solid var(--error)`
            }}
          >
            <p className="flex items-center" style={{ color: 'var(--error)' }}>
              <svg
                className="w-5 h-5 mr-2"
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
              {error}
            </p>
          </div>
        )}

        <div 
          className="rounded-xl shadow-lg p-8 space-y-8"
          style={{
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Section */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
              Blog Title *
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-6 py-4 text-xl focus:outline-none focus:ring-1 transition-all duration-300"
              style={{
                backgroundColor: 'var(--cardSecondary)',
                border: `2px solid var(--border)`,
                color: 'var(--text)',
                '--tw-ring-color': 'var(--accent)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              placeholder="Update your blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category & Thumbnail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--cardSecondary)',
                  border: `2px solid var(--border)`,
                  color: 'var(--text)',
                  '--tw-ring-color': 'var(--accent)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              >
                <option value="">Select Category</option>
                <option value="business">Business & Strategy</option>
                <option value="marketing">Marketing & Sales</option>
                <option value="success">Success Stories</option>
                <option value="training">Training & Education</option>
                <option value="news">News & Updates</option>
              </select>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Featured Thumbnail
              </label>
              <div 
                className="border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300"
                style={{ 
                  borderColor: 'var(--border)'
                }}
                onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  {thumbnailPreview ? (
                    <div className="space-y-3">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        width={400}
                        height={128}
                        className="mx-auto h-32 w-full object-cover rounded-lg shadow-md"
                      />
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Thumbnail Selected (Click to change)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                      <p className="text-gray-600">
                        Click to upload new thumbnail
                      </p>
                      <p className="text-xs text-gray-500">
                        Recommended: 1200x630px
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Multiple Images Upload */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Upload Additional Images
              </label>
              <div 
                className="border-2 border-dashed rounded-xl p-6 transition-all duration-300 h-full"
                style={{ borderColor: 'var(--border)' }}
                onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block text-center"
                >
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
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
                    <p style={{ color: 'var(--text)' }}>Upload Images</p>
                    <p className="text-xs opacity-70">PNG, JPG, WEBP</p>
                  </div>
                </label>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {uploadedImages.some(img => img.isExisting) ? 'Images:' : 'New Images:'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image.preview}
                            alt={image.name}
                            width={80}
                            height={80}
                            className="w-full h-16 object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <button
                            type="button"
                            onClick={() => insertImageToEditor(image.preview)}
                            className="button absolute bottom-1 left-1 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Insert
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Upload */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Upload Additional Videos
              </label>
              <div 
                className="border-2 border-dashed rounded-xl p-6 transition-all duration-300 h-full"
                style={{ borderColor: 'var(--border)' }}
                onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
              >
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer block text-center"
                >
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <p style={{ color: 'var(--text)' }}>Upload Videos</p>
                    <p className="text-xs opacity-70">MP4, MOV files</p>
                  </div>
                </label>

                {/* Uploaded Videos List */}
                {uploadedVideos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      New Videos:
                    </p>
                    {uploadedVideos.map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg px-3 py-2"
                        style={{ backgroundColor: 'var(--cardSecondary)' }}
                      >
                        <span className="text-sm truncate" style={{ color: 'var(--text)' }}>
                          {video.name}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const url = await uploadFileToServer(
                                  video.file,
                                  "blog-videos"
                                );
                                if (url) {
                                  insertVideoToEditor(url);
                                  toast.success("Video uploaded and inserted");
                                }
                              } catch (err) {
                                console.error("Insert upload failed:", err);
                                toast.error(
                                  "Failed to upload video. Try again."
                                );
                              }
                            }}
                            className="button text-xs text-white px-2 py-1 rounded"
                          >
                            Insert
                          </button>
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Video Links */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Video Links
              </label>
              <div className="border-2 border-gray-200 rounded-xl p-6 h-full">
                <div className="space-y-3">
                  {videoLinks.map((link, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateVideoLink(index, e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8200DB]"
                      />
                      <button
                        type="button"
                        onClick={() => insertVideoLinkToEditor(link)}
                        disabled={!link.trim()}
                        className="bg-[#8200DB] text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Insert
                      </button>
                      {videoLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVideoLink(index)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVideoLink}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-gray-600 hover:border-[#8200DB] hover:text-[#8200DB] transition-all duration-300"
                  >
                    + Add Another Video Link
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>Supported: YouTube, Vimeo, and direct video links</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO & Organization Section */}
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tags */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--cardSecondary)',
                    border: `2px solid var(--border)`,
                    color: 'var(--text)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  placeholder="mlm, business, success, marketing"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-sm opacity-70">
                  Separate with commas for better categorization
                </p>
              </div>

              {/* SEO Keywords */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
                  SEO Keywords
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--cardSecondary)',
                    border: `2px solid var(--border)`,
                    color: 'var(--text)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  placeholder="network marketing, passive income, home business"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <p className="text-sm opacity-70">
                  Keywords for search engine optimization
                </p>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
              Excerpt
            </label>
            <textarea
              className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300 resize-none"
              style={{
                backgroundColor: 'var(--cardSecondary)',
                border: `2px solid var(--border)`,
                color: 'var(--text)',
                '--tw-ring-color': 'var(--accent)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              placeholder="Update your blog summary for search results and social media..."
              rows="4"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-semibold" style={{ color: 'var(--text)' }}>
                Content *
              </label>
              <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--textSecondary)' }}>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
                <span>Markdown Supported</span>
              </div>
            </div>
            <div
              data-color-mode="light"
              className="rounded-xl overflow-hidden shadow-sm"
              style={{ border: `2px solid var(--border)` }}
            >
              <MDEditor
                value={content}
                onChange={setContent}
                height={500}
                preview="live"
              />
            </div>
            <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--textSecondary)' }}>
              <span># Headings</span>
              <span>**Bold**</span>
              <span>*Italic*</span>
              <span>- Lists</span>
              <span>[Links](url)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8" style={{ borderTop: `1px solid var(--border)` }}>
            <button
              type="button"
              onClick={() => router.push("/blog-editor")}
              className="px-8 py-3 rounded-xl transition-all duration-300 font-semibold"
              style={{
                backgroundColor: 'var(--cardSecondary)',
                color: 'var(--text)',
                border: `2px solid var(--border)`
              }}
            >
              ← Back to Dashboard
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  const url = `/blogs/${id}`;
                  if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
                  else router.push(url);
                }}
                className="px-8 py-3 rounded-xl transition-all duration-300 font-semibold"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--primary)',
                  border: `2px solid var(--primary)`
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--primary)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--primary)';
                }}
              >
                Preview Blog
              </button>

              <button
                type="submit"
                disabled={loading}
                className="button px-8 py-3 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Blog Post"
                )}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

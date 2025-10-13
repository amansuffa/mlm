"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CreateBlogPage() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Thumbnail Upload
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  // Handle Multiple Images Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  // Handle Video Upload
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => ({
      file,
      name: file.name,
      type: file.type
    }));
    setUploadedVideos(prev => [...prev, ...newVideos]);
  };

  // Remove Image
  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove Video
  const removeVideo = (index) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Insert Image into Editor
  const insertImageToEditor = (imageUrl) => {
    const markdownImage = `![Image](${imageUrl})`;
    setContent(prev => prev + `\n${markdownImage}\n`);
  };

  // Insert Video into Editor
  const insertVideoToEditor = (videoUrl) => {
    const markdownVideo = `[Video](${videoUrl})`;
    setContent(prev => prev + `\n${markdownVideo}\n`);
  };

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt);
      formData.append("tags", tags);
      formData.append("keywords", keywords);
      formData.append("category", category);
      
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      // Append multiple images
      uploadedImages.forEach((image, index) => {
        formData.append(`images`, image.file);
      });

      // Append multiple videos
      uploadedVideos.forEach((video, index) => {
        formData.append(`videos`, video.file);
      });

      const res = await fetch("/api/blogs", {
        method: "POST",
        body: formData, // Use FormData instead of JSON
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create blog");
        setLoading(false);
        return;
      }

      router.push("/blog-editor");
    } catch (err) {
      console.error("Error creating blog:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto rounded-2xl shadow-xl overflow-hidden">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-[#8200DB] to-[#6E11B0] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Create Blog Post</h1>
              <p className="text-blue-100 mt-2">Craft amazing content for your audience</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white text-sm font-medium">Professional Editor</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleCreate} className="p-8 space-y-8">
          {/* Title Section */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              Blog Title *
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-xl focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
              placeholder="Craft a compelling title that grabs attention..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category & Thumbnail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300 bg-white"
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
              <label className="block text-lg font-semibold text-gray-800">
                Featured Thumbnail *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#8200DB] transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnail-upload"
                  required
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
                      <p className="text-sm text-green-600 font-medium">✓ Thumbnail Selected</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-600">Click to upload thumbnail</p>
                      <p className="text-xs text-gray-500">Recommended: 1200x630px</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Multiple Images Upload */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Upload Images for Content
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#8200DB] transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block text-center">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600">Upload multiple images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </label>
                
                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">Uploaded Images:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image.preview}
                            alt={image.name}
                            width={80}
                            height={80}
                            className="w-full h-20 object-cover rounded-lg shadow-sm"
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
                            className="absolute bottom-1 left-1 bg-[#8200DB] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
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
              <label className="block text-lg font-semibold text-gray-800">
                Upload Videos for Content
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#8200DB] transition-all duration-300">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer block text-center">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600">Upload video files</p>
                    <p className="text-xs text-gray-500">MP4, MOV up to 50MB</p>
                  </div>
                </label>
                
                {/* Uploaded Videos List */}
                {uploadedVideos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded Videos:</p>
                    {uploadedVideos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-sm text-gray-600 truncate">{video.name}</span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => insertVideoToEditor(URL.createObjectURL(video.file))}
                            className="text-xs bg-[#8200DB] text-white px-2 py-1 rounded"
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
          </div>

          {/* SEO & Organization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tags */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Tags
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                placeholder="mlm, business, success, marketing"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-sm text-gray-500">Separate with commas for better categorization</p>
            </div>

            {/* SEO Keywords */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                SEO Keywords
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                placeholder="network marketing, passive income, home business"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <p className="text-sm text-gray-500">Keywords for search engine optimization</p>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              Excerpt
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300 resize-none"
              placeholder="Write a compelling summary that appears in search results and social media previews..."
              rows="4"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-semibold text-gray-800">
                Content *
              </label>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span>Markdown Supported</span>
              </div>
            </div>
            <div data-color-mode="light" className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <MDEditor
                value={content}
                onChange={setContent}
                height={500}
                preview="edit"
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span># Headings</span>
              <span>**Bold**</span>
              <span>*Italic*</span>
              <span>- Lists</span>
              <span>[Links](url)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/blog-editor")}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
            >
              ← Back to Editor
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                className="px-8 py-3 border-2 border-[#8200DB] text-[#8200DB] rounded-xl hover:bg-[#8200DB] hover:text-white transition-all duration-300 font-semibold"
              >
                Save Draft
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] text-white rounded-xl hover:from-[#6E11B0] hover:to-[#8200DB] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  "Publish Blog Post"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
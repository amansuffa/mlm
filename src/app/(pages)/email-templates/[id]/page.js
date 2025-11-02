"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import axios from "axios";
import AvailableVariables from "@/components/AvailableVariables";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditEmailTemplate() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [originalBody, setOriginalBody] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "",
    category: "",
    subject: "",
    body: "",
  });

  // Convert markdown to HTML with proper line breaks
  const convertToHtml = (markdown) => {
    if (!markdown) return "";
    
    // First, convert line breaks to <br> tags
    let html = markdown.replace(/\n/g, '<br>');
    
    // Then handle other markdown basics
    html = html
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2" style="color: #8200DB; text-decoration: none;">$1</a>')
      // Lists
      .replace(/^\s*\- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    return html;
  };

  // Convert HTML back to markdown for editing
  const convertToMarkdown = (html) => {
    if (!html) return "";
    
    let markdown = html
      // Replace <br> tags with newlines
      .replace(/<br\s*\/?>/gi, '\n')
      // Headers
      .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
      // Bold
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      // Italic
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      // Links
      .replace(/<a\s+href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '[$2]($1)')
      // Lists
      .replace(/<ul>\s*<li>(.*?)<\/li>\s*<\/ul>/gis, '- $1\n')
      .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
      // Remove other HTML tags but keep content
      .replace(/<[^>]*>/g, '')
      // Clean up multiple newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return markdown.trim();
  };

  const fetchTemplate = useCallback(async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get("/api/email-templates");
      const template = res.data.find((t) => t._id === params.id);
      
      if (template) {
        // Convert stored HTML back to markdown for editing
        const bodyMarkdown = template.body_markdown || convertToMarkdown(template.body);
        
        setForm({
          name: template.name || "",
          type: template.type || "",
          category: template.category || "",
          subject: template.subject || "",
          body: bodyMarkdown,
        });
        setOriginalBody(bodyMarkdown);
      } else {
        setError("Template not found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load template");
    } finally {
      setFetchLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert the markdown body to HTML before saving
      const formData = {
        id: params.id,
        name: form.name,
        type: form.type,
        category: form.category,
        subject: form.subject,
        body: convertToHtml(form.body),
        body_markdown: form.body // Save markdown version for future editing
      };

      await axios.put("/api/email-templates", formData);
      toast.success("Email template updated successfully!");
      router.push("/email-templates");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle editor change
  const handleEditorChange = (value) => {
    setForm({ ...form, body: value });
  };

  // Check if form has changes
  const hasChanges = form.body !== originalBody || 
                    form.name !== form.name || 
                    form.category !== form.category || 
                    form.subject !== form.subject;

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8200DB] mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading template data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto rounded-2xl shadow-xl overflow-hidden">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-[#8200DB] to-[#6E11B0] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Edit Email Template
              </h1>
              <p className="text-blue-100 mt-2">
                Update and refine your email template
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <div className="bg-yellow-500/20 rounded-lg px-3 py-1">
                  <span className="text-yellow-200 text-sm font-medium">
                    Unsaved Changes
                  </span>
                </div>
              )}
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-white text-sm font-medium">
                  Editing Mode
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 flex items-center">
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

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Template Name & Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Template Name *
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                placeholder="Welcome Email Template"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Template Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300 bg-white"
                required
              >
                <option value="">Select Template Category</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Sponsor">Sponsor</option>
                <option value="Promotion">Promotion</option>
                <option value="System">System</option>
                <option value="Sponsor of Sponsor">Sponsor of Sponsor</option>
                <option value="Leads">Leads</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Email Subject */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              Email Subject *
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
              placeholder="Welcome to Our MLM Family! 🎉"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>

          {/* Available Variables */}
         <AvailableVariables/>

          {/* Email Body Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-semibold text-gray-800">
                Email Body *
              </label>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
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
                <span>Markdown & HTML Supported</span>
              </div>
            </div>
            <div
              data-color-mode="light"
              className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <MDEditor
                value={form.body}
                onChange={handleEditorChange}
                height={400}
                preview="edit"
                textareaProps={{
                  placeholder: "Write your email content here...\n\nPress Enter for new lines\nUse **bold** for emphasis\nAdd variables like {{FirstName}}"
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span># Headings</span>
              <span>**Bold**</span>
              <span>*Italic*</span>
              <span>- Lists</span>
              <span>[Links](url)</span>
              <span>Enter = &lt;br&gt; tag</span>
              <span>HTML allowed</span>
            </div>
          </div>

          {/* Real-time Preview Section */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              Live Preview
            </label>
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-white min-h-[200px]">
              {form.body ? (
                <div 
                  className="email-preview prose max-w-none"
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: convertToHtml(form.body) 
                  }}
                />
              ) : (
                <div className="text-gray-400 text-center py-8">
                  <svg
                    className="w-12 h-12 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <p>Start typing above to see the preview here</p>
                  <p className="text-sm mt-1">Enter key will create line breaks in the final email</p>
                </div>
              )}
            </div>
          </div>

          {/* HTML Output Preview (Optional) */}
          {form.body && (
            <div className="space-y-3">
              <details className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <summary className="bg-gray-50 px-6 py-4 cursor-pointer font-semibold text-gray-800">
                  HTML Output (What gets stored)
                </summary>
                <div className="p-4 bg-white">
                  <code className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {convertToHtml(form.body)}
                  </code>
                </div>
              </details>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/email-templates")}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
            >
              ← Back to Templates
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: form.name,
                    type: form.type,
                    category: form.category,
                    subject: form.subject,
                    body: originalBody
                  });
                  toast.success("Changes reverted");
                }}
                disabled={!hasChanges}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Revert Changes
              </button>

              <button
                type="submit"
                disabled={loading || !form.body || !hasChanges}
                className="px-8 py-3 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] text-white rounded-xl hover:from-[#6E11B0] hover:to-[#8200DB] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                  "Update Template"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
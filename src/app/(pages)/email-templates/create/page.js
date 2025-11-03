"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import axios from "axios";
import AvailableVariables from "@/components/AvailableVariables";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CreateEmailTemplate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    let html = String(markdown);

    // Convert headings (order matters - longest patterns first)
    html = html.replace(/^###### (.+)$/gm, '<h6 style="font-size: 0.875rem; font-weight: bold; margin: 0.5rem 0 0.125rem 0;">$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5 style="font-size: 1rem; font-weight: bold; margin: 0.625rem 0 0.1875rem 0;">$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4 style="font-size: 1.125rem; font-weight: bold; margin: 0.75rem 0 0.25rem 0;">$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3 style="font-size: 1.25rem; font-weight: bold; margin: 1rem 0 0.5rem 0;">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 style="font-size: 1.5rem; font-weight: bold; margin: 1.25rem 0 0.75rem 0;">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 style="font-size: 1.875rem; font-weight: bold; margin: 1.5rem 0 1rem 0;">$1</h1>');
    
    // Convert asterisk headings (*** = h1, ** = h2, * = h3)
    html = html.replace(/^\*\*\*\s*(.+)$/gm, '<h1 style="font-size: 1.875rem; font-weight: bold; margin: 1.5rem 0 1rem 0;">$1</h1>');
    html = html.replace(/^\*\*\s*(.+)$/gm, '<h2 style="font-size: 1.5rem; font-weight: bold; margin: 1.25rem 0 0.75rem 0;">$1</h2>');
    html = html.replace(/^\*\s*(.+)$/gm, '<h3 style="font-size: 1.25rem; font-weight: bold; margin: 1rem 0 0.5rem 0;">$1</h3>');

    // Convert bold text **text** or __text__
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Convert italic text *text* or _text_
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Convert links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #8200DB; text-decoration: none;">$1</a>');

    // Convert unordered lists - item
    html = html.replace(/^- (.+)$/gm, '<li style="margin-left: 1rem;">$1</li>');
    html = html.replace(/(<li[^>]*>.*<\/li>)/s, '<ul style="margin: 1rem 0;">$1</ul>');

    // Convert ordered lists 1. item
    html = html.replace(/^\d+\. (.+)$/gm, '<li style="margin-left: 1rem;">$1</li>');
    html = html.replace(/(<li[^>]*>.*<\/li>)/s, '<ol style="margin: 1rem 0; list-style-type: decimal; padding-left: 1rem;">$1</ol>');

    // Convert blockquotes > text
    html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left: 4px solid #ccc; padding-left: 1rem; font-style: italic; color: #666; margin: 1rem 0;">$1</blockquote>');

    // Convert horizontal rules ---
    html = html.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid #ccc; margin: 1.5rem 0;">');



    // Replace newlines with <br/>
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert the markdown body to HTML before saving
      const formData = {
        ...form,
        body: convertToHtml(form.body),
        body_markdown: form.body // Optional: save markdown version too
      };

      await axios.post("/api/email-templates", formData);
      toast.success("Email template created successfully!");
      router.push("/email-templates");
    } catch (err) {
      console.error("Create template error:", err);
      toast.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle editor change and show real-time preview
  const handleEditorChange = (value) => {
    setForm({ ...form, body: value });
  };

  // Handle small text insertion
  const insertSmallText = () => {
    const htmlTag = '<small>TEXT_HERE</small>';
    const newBody = (form.body || '') + htmlTag;
    setForm({ ...form, body: newBody });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto rounded-2xl shadow-xl overflow-hidden">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-[#8200DB] to-[#6E11B0] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Create Email Template
              </h1>
              <p className="text-blue-100 mt-2">
                Design professional email templates for your MLM communications
              </p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white text-sm font-medium">
                Template Builder
              </span>
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
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={insertSmallText}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#8200DB] hover:bg-[#6E11B0] text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                  Small Text
                </button>
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
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
              <span># Headings</span>
              <span>**Bold**</span>
              <span>*Italic*</span>
              <span>- Lists</span>
              <span>[Links](url)</span>
              <span>&lt;small&gt; tag</span>
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
              <label className="block text-lg font-semibold text-gray-800">
                HTML Output (What gets stored)
              </label>
              <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                <code className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {convertToHtml(form.body)}
                </code>
              </div>
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
                onClick={() => setForm({ name: "", type: "", category: "", subject: "", body: "" })}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={loading || !form.body}
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
                    Creating...
                  </>
                ) : (
                  "Create Template"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
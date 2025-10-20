"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import axios from "axios";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditEmailTemplate() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "",
    category: "",
    subject: "",
    body: "",
  });

  const fetchTemplate = useCallback(async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get("/api/email-templates");
      const template = res.data.find((t) => t._id === params.id);
      
      if (template) {
        setForm({
          name: template.name || "",
          type: template.type || "",
          category: template.category || "",
          subject: template.subject || "",
          body: template.body || "",
        });
      } else {
        setError("Template not found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load template");
    } finally {
      setFetchLoading(false);
    }
  }, [params.id, setForm, setError, setFetchLoading])

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put("/api/email-templates", { id: params.id, ...form });
      toast.success("Email template updated successfully!");
      router.push("/email-templates");
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white text-sm font-medium">
                Editing Mode
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Available Variables
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{FirstName}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{MemberFullName}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{MemberUsername}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{SponsorName}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{MemberEmail}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{NewMemberName}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{ActivationDate}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{LoginLink}}"}
              </code>
            </div>
            <p className="text-blue-600 text-sm mt-3">
              Use these variables in your template. They will be replaced with actual values when sending emails.
            </p>
          </div>

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
                onChange={(value) => setForm({ ...form, body: value })}
                height={400}
                preview="edit"
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span># Headings</span>
              <span>**Bold**</span>
              <span>*Italic*</span>
              <span>- Lists</span>
              <span>[Links](url)</span>
              <span>HTML allowed</span>
            </div>
          </div>

          {/* Preview Section */}
          {form.body && (
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-800">
                Preview
              </label>
              <div className="border-2 border-gray-200 rounded-xl p-6 bg-white">
                <div className="prose max-w-none">
                  <div 
                    className="email-preview"
                    dangerouslySetInnerHTML={{ __html: form.body }}
                  />
                </div>
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
                type="submit"
                disabled={loading}
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
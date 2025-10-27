"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { useTheme } from "next-themes";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const res = await axios.get("/api/email-templates");
      setTemplates(res.data);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, templateName) {
    toast(
      (t) => (
        <div className={`flex flex-col space-y-3 text-[var(--text)]`}>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <span className="font-medium">Delete Template</span>
          </div>
          <p className="text-sm opacity-90">
            Are you sure you want to delete <strong>{templateName}</strong>? This action cannot be undone.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete("/api/email-templates", { data: { id } });
                  toast.success("Email template deleted successfully!");
                  fetchTemplates();
                } catch (err) {
                  console.error("Delete failed:", err);
                  toast.error("Failed to delete template");
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: 'var(--cardsec)',
                color: 'var(--text)'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          color: 'var(--text)',
        },
      }
    );
  }

  function handleEditTemplate(templateId) {
    router.push(`/email-templates/${templateId}`);
  }

  // Filter templates based on search and type
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = 
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || template.category === filterType;
    return matchesSearch && matchesType;
  });

  const templateTypes = ["all", "Admin", "User", "Sponsor", "Promotion", "System", "Sponsor of Sponsor", "Leads", "Other"];

  

  return (
    <div 
      className="min-h-screen py-8"    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    Email Templates
                  </h1>
                  <p className="text-white text-opacity-90 text-lg">
                    Manage and create email templates for your MLM communications
                  </p>
                </div>
                <Link
                  href="/email-templates/create"
                  className="bg-white text-gray-800 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                  style={{ color: 'var(--primary)' }}
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  <span>Create New Template</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="rounded-xl" style={{border: `1px solid var(--border)`}}>
          <div 
            className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl"
            style={{ 
              backgroundColor: 'var(--card)',
              borderLeftColor: 'var(--primary)',
              borderColor: 'var(--primary)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Templates</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                  {templates.length}
                </p>
              </div>
              <div 
                className="p-3 rounded-lg bg-[var(--primary)]/20"
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: 'var(--primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
</div>
      
        </div>

        {/* Filters and Search */}
        <div 
          className="rounded-xl shadow-lg p-6 mb-6"
          style={{ 
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: `var(--cardsec)`,
                    border: `2px solid var(--border)`,
                    color: 'var(--text)'
                  }}
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5"
                  style={{ color: 'var(--primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="flex space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-xl px-4 py-3 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--cardsec)',
                  border: '2px solid var(--border)',
                  color: 'var(--text)'
                }}
              >
                {templateTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Table */}
        {loading ? (
          <div 
            className="rounded-xl shadow-lg p-12 text-center"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p className="mt-4 text-lg opacity-80">Loading your templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div 
            className="rounded-xl shadow-lg p-12 text-center"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--primary)', opacity: '0.1' }}
            >
              <svg
                className="w-12 h-12"
                style={{ color: 'var(--primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              No templates found
            </h3>
            <p className="mb-6 opacity-80">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first email template"}
            </p>
            <Link
              href="/email-templates/create"
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              style={{ 
                background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                color: 'white'
              }}
            >
              <span>Create Your First Template</span>
            </Link>
          </div>
        ) : (
          <div 
            className="rounded-xl shadow-lg overflow-hidden"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: `var(--cardsec)` }}>
                    <th className="text-left py-4 px-6 font-semibold">Name</th>
                    <th className="text-left py-4 px-6 font-semibold">Type</th>
                    <th className="text-left py-4 px-6 font-semibold">Subject</th>
                    <th className="text-left py-4 px-6 font-semibold">Last Updated</th>
                    <th className="text-center py-4 px-6 font-semibold w-48">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.map((template, index) => (
                    <tr 
                      key={template._id} 
                      className="transition-colors duration-200 hover:opacity-90"
                      style={{ 
                        borderBottom: index !== filteredTemplates.length - 1 ? `1px solid var(--border)` : 'none',
                        backgroundColor: `transparent`
                      }}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text)' }}>{template.name}</p>
                          <p className="text-sm opacity-70">{template.type}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span 
                          className="px-3 py-1 rounded-full text-xs bg-[var(--primary)]/20 text-[var(--primary)] font-semibold whitespace-nowrap transition-all duration-300"
                        >
                          {template.category || "General"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="line-clamp-2 opacity-90">{template.subject}</p>
                      </td>
                      <td className="py-4 px-6 text-sm opacity-70">
                        {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditTemplate(template._id)}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm hover:shadow-lg"
                            style={{ 
                              backgroundColor: 'var(--primary)',
                              color: 'white'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(template._id, template.name)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

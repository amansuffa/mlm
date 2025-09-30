"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch templates
  async function fetchTemplates() {
    try {
      setLoading(true);
      const res = await fetch("/api/email-templates");
      const data = await res.json();

      if (Array.isArray(data)) setTemplates(data);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoading(false);
    }
  }

  // Delete template
  async function deleteTemplate(id) {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const res = await fetch(`/api/email-templates?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        alert("Template deleted successfully");
        fetchTemplates();
      } else {
        alert(data.error || "Failed to delete template");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // Edit template
  function handleEditTemplate(id) {
    router.push(`/email-templates/${id}`);
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
        <button
          onClick={() => router.push("/email-templates/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create New Template
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-600">No templates found. Create one!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 bg-white rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl) => (
                <tr key={tpl._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{tpl.name}</td>
                  <td className="p-3 text-gray-600">{tpl.subject}</td>
                  <td className="p-3 text-gray-600">
                    {tpl.isDefault ? "Default (Admin)" : tpl.ownerId ? "User" : "Admin"}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEditTemplate(tpl._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTemplate(tpl._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

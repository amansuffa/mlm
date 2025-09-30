"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTemplatePage() {
  const router = useRouter();
  const [name, setname] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, subject, body }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create template");
        setLoading(false);
        return;
      }

      router.push("/email-templates");
    } catch (err) {
      console.error("Error creating template:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Template</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Enter template name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body</label>
          <textarea
            className="w-full border rounded p-2 min-h-[150px]"
            placeholder="Write your email body here (you can use {{variables}})..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/email-templates")}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Template"}
          </button>
        </div>
      </form>
    </div>
  );
}

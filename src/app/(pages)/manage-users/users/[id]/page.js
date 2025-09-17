"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user data on page load
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        const data = await res.json();
        if (!data.error) setUser(data);
        else setMessage(data.error);
      } catch (err) {
        setMessage("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // ✅ Only send status and role to backend
        body: JSON.stringify({
          status: user.status,
          role: user.role,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setMessage("✅ User updated successfully!");
      } else {
        setMessage(data.error || "Failed to update user");
      }
    } catch (err) {
      setMessage("Error updating user");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-center mt-10">Loading user...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">{message}</p>;

  return (
   
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit User</h1>

        {message && (
          <p className="mb-4 text-center text-sm text-green-600">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <table className="w-full text-sm border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border p-2 font-medium">Name</td>
                <td className="border p-2">{user.name}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Email</td>
                <td className="border p-2">{user.email}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Username</td>
                <td className="border p-2">{user.username}</td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Status</td>
                <td className="border p-2">
                  <select
                    value={user.status}
                    onChange={(e) =>
                      setUser({ ...user, status: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="Free Member">Free Member</option>
                    <option value="Admin Fee Paid">Admin Fee Paid</option>
                    <option value="Membership Paid">Membership Paid</option>
                    <option value="Fully Active">Fully Active</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="border p-2 font-medium">Role</td>
                <td className="border p-2">
                  <select
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => router.push("/manage-users")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded text-white ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
 
  );
}

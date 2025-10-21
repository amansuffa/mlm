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
        body: JSON.stringify({
          status: user.status,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#8200DB] mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">User Not Found</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => router.push("/manage-users")}
            className="bg-[#8200DB] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6E11B0] transition-all duration-300"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    User Details
                  </h1>
                  <p className="text-blue-100">
                    Manage user status and information
                  </p>
                </div>
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-white text-sm font-medium">
                    Editing: {user.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-center ${
                message.includes("✅") 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                <p className="font-medium">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Basic Info */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      Full Name
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                      <p className="text-gray-700">{user.name}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      Email Address
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                      <p className="text-gray-700">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      Username
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                      <p className="text-gray-700">{user.username}</p>
                    </div>
                  </div>
                </div>

                {/* User Settings */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      User Status
                    </label>
                    <select
                      value={user.status}
                      onChange={(e) => setUser({ ...user, status: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300 bg-white"
                    >
                      <option value="free">Free Member</option>
                      <option value="admin_fee_paid">Admin Fee Paid</option>
                      <option value="membership_paid">Membership Paid</option>
                      <option value="fully_active">Fully Active</option>
                    </select>
                    
                  </div>

                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      Sponsered By
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                      <p className="text-gray-700">
                        {user.referredBy}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-lg font-semibold text-gray-800">
                      Joined Date
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                      <p className="text-gray-700">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/manage-users")}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
                >
                  ← Back to Users
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] text-white rounded-xl hover:from-[#6E11B0] hover:to-[#8200DB] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
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
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
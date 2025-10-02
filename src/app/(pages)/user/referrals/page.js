"use client";
import { useState, useEffect } from "react";

export default function ReferralsPage() {
  const [referralData, setReferralData] = useState({
    username: "",
    referralLink: "",
    referrals: []
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReferrals() {
      try {
        const res = await fetch("/api/referrals");
        const data = await res.json();

        if (res.ok) {
          setReferralData({
            username: data.referralId, 
            referralLink: `${window.location.origin}/signup?ref=${data.referralId}`,
            referrals: data.referrals
          });
        }
      } catch (err) {
        console.error("Failed to load referrals", err);
      }
    }
    fetchReferrals();
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Referrals</h1>

      {/* Referral Information */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-1">
            Your Referral Id: <span className="text-lg font-semibold text-gray-800">{referralData.username}</span>
          </p>
        </div>
        <div>
          <p className="text-gray-700 font-medium mb-2">Your referral link:</p>
          <div className="flex items-center">
            <input
              type="text"
              value={referralData.referralLink}
              readOnly
              className="flex-1 px-3 py-2 border rounded-l-lg bg-gray-100 text-gray-600"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-gray-400 text-white rounded-r-lg hover:bg-gray-500 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Referral List Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">People you referred</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Join Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {referralData.referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-gray-500 text-center">No referrals yet.</td>
                </tr>
              ) : (
                referralData.referrals.map((ref, i) => {
                  let statusText = "";
                  let statusClass = "";

                  switch (ref.status) {
                    case "free":
                      statusText = "Free";
                      statusClass = "bg-gray-100 text-gray-700";
                      break;
                    case "admin_fee_paid":
                      statusText = "Admin Fee Paid";
                      statusClass = "bg-yellow-100 text-yellow-700";
                      break;
                    case "membership_paid":
                      statusText = "Membership Paid";
                      statusClass = "bg-blue-100 text-blue-700";
                      break;
                    case "fully_active":
                      statusText = "Fully Active";
                      statusClass = "bg-green-100 text-green-700";
                      break;
                    default:
                      statusText = "Free";
                      statusClass = "bg-gray-100 text-gray-700";
                  }

                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition">
                      <td className="px-4 py-2 font-medium">{ref.name}</td>
                      <td className="px-4 py-2">{ref.username}</td>
                      <td className="px-4 py-2">{new Date(ref.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2 justify-center">
                        <button
                          onClick={() => alert(`Start chat with ${ref.name}`)}
                          className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                        >
                          💬 Chat
                        </button>
                        <button
                          onClick={() => window.location.href = `mailto:${ref.email}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          📧 Email
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

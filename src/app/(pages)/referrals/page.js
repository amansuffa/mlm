"use client";
import Layout from "@/components/Layout";
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
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Referrals</h1>

      {/* Referral Information */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <p className="text-gray-700 font-medium mb-1">Your Referral Id: <span className="text-lg font-semibold text-gray-800">{referralData.username}</span></p>
          
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
              onClick={() => {
                navigator.clipboard.writeText(referralData.referralLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded-r-lg hover:bg-gray-500 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Referral List */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          People you referred
        </h2>
        {referralData.referrals.length === 0 ? (
          <p className="text-gray-500">No referrals yet.</p>
        ) : (
          <ul className="space-y-3">
            {referralData.referrals.map((ref) => (
              
              <li
                key={ref.username}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-white">
                    {ref.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium block">{ref.name}</span>
                    <span className="text-gray-500 text-sm">@{ref.username}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Joined: {new Date(ref.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => alert(`Start chat with ${ref.name}`)}
                    className="px-3 py-1 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                  >
                    💬 Chat
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

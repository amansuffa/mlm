"use client";
import React from "react";

export default function TopReferrers() {
  const top = [
    { name: "John Doe", referrals: 15 },
    { name: "Sarah Khan", referrals: 12 },
    { name: "Ali Raza", referrals: 10 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-700 mb-4">👑 Top Referrers</h3>

      {/* List */}
      <ul className="space-y-3">
        {top.map((t, i) => (
          <li
            key={t.name}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* Left */}
            <div>
              <p className="font-medium text-gray-800">{t.name}</p>
              <p className="text-xs text-gray-500">Referrals</p>
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="text-lg font-bold text-gray-700">{t.referrals}</p>
              <span className="text-xs text-gray-400"># {i + 1}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

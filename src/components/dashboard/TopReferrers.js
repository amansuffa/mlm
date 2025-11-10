"use client";
import React, { useState, useEffect } from "react";

export default function TopReferrers() {
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopReferrers();
  }, []);

  const fetchTopReferrers = async () => {
    try {
      const response = await fetch("/api/dashboard/top-referrers");
      const result = await response.json();
      
      if (response.ok) {
        setTop(result);
      }
    } catch (error) {
      console.error("Error fetching top referrers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-700 mb-4">👑 Top Referrers</h3>

      {/* List */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : top.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No data available</div>
      ) : (
        <ul className="space-y-3">
          {top.map((t, i) => (
            <li
              key={t.username}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* Left */}
              <div>
                <p className="font-medium text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-500">Total Sales</p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-700">{t.totalSales}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

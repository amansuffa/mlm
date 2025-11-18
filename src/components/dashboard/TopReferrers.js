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
    <div className="card rounded-2xl shadow-lg p-6 h-full flex flex-col">
      {/* Header */}
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>👑 Top Referrers</h3>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4" style={{ color: 'var(--text)' }}>Loading...</div>
        ) : top.length === 0 ? (
          <div className="text-center py-4" style={{ color: 'var(--textSecondary)' }}>No data available</div>
        ) : (
          <ul className="space-y-3">
            {top.map((t, i) => (
              <li
                key={t.username}
                className="flex items-center justify-between p-3 card-secondary rounded-xl shadow-sm hover:shadow-md transition"
              >
                {/* Left */}
                <div>
                  <p className="font-medium" style={{ color: 'var(--text)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--textSecondary)' }}>Total Sales</p>
                </div>

                {/* Right */}
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>{t.totalSales}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

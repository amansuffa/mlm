"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import {useSession} from "next-auth/react";

export default function EarningsChart() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [period, setPeriod] = useState("weekly");
  const [isCustomRange, setIsCustomRange] = useState(false);
  
  const userId = session?.user?.id; 
  const fetchEarnings = useCallback(async () => {
    try {
      const params = { userId };
      if (from && to) {
        params.from = from;
        params.to = to;
        setIsCustomRange(true);
      } else {
        params.period = period;
        setIsCustomRange(false);
      }
      
      const res = await axios.get("/api/earnings", { params });

      const formatted = res.data.data.map((item) => ({
        period: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        amount: item.amount,
        source: item.source,
      }));

      setData(formatted);
    } catch (error) {
      console.error(error);
    }
  }, [userId, from, to, period]);

  useEffect(() => {
    if (userId) fetchEarnings();
  }, [userId, fetchEarnings]);

  return (
    <div className="card p-6 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>💰 Earnings Overview</h3>
        <span className="text-sm font-medium" style={{ color: 'var(--textSecondary)' }}>USD</span>
      </div>

      {/* Date Range Filters */}
      <div className="flex gap-3 mb-5">
        <input
          type="date"
          className="card-secondary rounded-lg px-3 py-1 text-sm"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          className="card-secondary rounded-lg px-3 py-1 text-sm"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          onClick={fetchEarnings}
          className="button text-white px-4 py-1 rounded-lg transition"
        >
          Filter
        </button>
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setFrom("");
            setTo("");
            setIsCustomRange(false);
          }}
          className="card-secondary rounded-lg px-3 py-1 text-sm ml-auto"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="all-time">All Time</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="period" 
              stroke="#6b7280" 
              tick={!isCustomRange} 
              interval={data.length > 10 ? Math.floor(data.length / 8) : 0}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px",
              }}
              labelStyle={{ color: "#6b7280", fontSize: "12px" }}
              itemStyle={{ color: "#111827", fontWeight: "600" }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="url(#purpleGradient)"
              strokeWidth={3}
              dot={{ r: 5, fill: "#6d28d9" }}
              activeDot={{ r: 7, fill: "#4c1d95" }}
            />

            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#4c1d95" stopOpacity={1} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

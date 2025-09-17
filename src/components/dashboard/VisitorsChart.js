"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { period: "Mon", commission: 20 },
  { period: "Tue", commission: 35 },
  { period: "Wed", commission: 45 },
  { period: "Thu", commission: 60 },
  { period: "Fri", commission: 80 },
  { period: "Sat", commission: 120 },
  { period: "Sun", commission: 160 }
];

export default function VisitorsChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-700">📈 Weekly Commissions</h3>
        <span className="text-sm font-medium text-gray-500">USD</span>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px"
              }}
              labelStyle={{ color: "#6b7280", fontSize: "12px" }}
              itemStyle={{ color: "#111827", fontWeight: "600" }}
            />
            <Line
              type="monotone"
              dataKey="commission"
              stroke="url(#purpleGradient)"
              strokeWidth={3}
              dot={{ r: 5, fill: "#6d28d9" }}
              activeDot={{ r: 7, fill: "#4c1d95" }}
            />

            {/* Gradient line color */}
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

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function EarningsChart() {
  // Dummy data — replace with API call for real data
  const data = [
    { week: "Week 1", earnings: 120 },
    { week: "Week 2", earnings: 200 },
    { week: "Week 3", earnings: 350 },
    { week: "Week 4", earnings: 450 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
      <h3 className="text-lg font-bold text-gray-700 mb-4">
        📈 Earnings Overview
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

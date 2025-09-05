"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const weeklyData = [
  { day: "Mon", revenue: 45 },
  { day: "Tue", revenue: 60 },
  { day: "Wed", revenue: 75 },
  { day: "Thu", revenue: 50 },
  { day: "Fri", revenue: 90 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-200">
        <p className="text-xs font-medium text-gray-600">{label}</p>
        <p className="text-sm font-bold text-gray-700">
          ${payload[0].value}k
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyRevenue() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white p-4">
        <h3 className="text-lg font-bold text-gray-700">📊 Weekly Revenue</h3>
        <p className="text-sm text-gray-500">Mon – Fri overview</p>
      </div>

      {/* Chart */}
      <div className="h-64 p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar
              dataKey="revenue"
              fill="url(#grayGradient)"
              radius={[10, 10, 0, 0]}
              animationDuration={1200}
              isAnimationActive={true}
            />
            {/* Gray gradient fill for bars */}
            <defs>
              <linearGradient id="grayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

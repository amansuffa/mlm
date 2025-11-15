"use client";
import { useEffect, useState, useCallback } from "react";
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
import { useSession } from "next-auth/react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card shadow-lg rounded-xl px-3 py-2">
        <p className="text-xs font-medium" style={{ color: 'var(--textSecondary)' }}>{label}</p>
        <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function EarningsChart() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [period, setPeriod] = useState("weekly");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isCustomRange, setIsCustomRange] = useState(false);

  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";

  const fetchData = useCallback(async () => {
    if (!userId || !isAdmin) return;
    
    const params = new URLSearchParams({
      userId,
      period,
      isAdmin: "true"
    });
    
    if (from && to) {
      params.append('from', from);
      params.append('to', to);
      setIsCustomRange(true);
    } else {
      setIsCustomRange(false);
    }
    
    const res = await fetch(`/api/admin/earnings/?${params}`);
    const json = await res.json();
    setData(json.data || []);
    setTotal(json.total || 0);
  }, [userId, period, isAdmin, from, to]);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, fetchData]);

  if (!isAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="card rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                📊 Platform Revenue
              </h3>
              <p className="text-sm" style={{ color: 'var(--textSecondary)' }}>Total earnings overview</p>
              <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>${total.toLocaleString()}</p>
            </div>
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setFrom("");
                setTo("");
                setIsCustomRange(false);
              }}
              className="card-secondary rounded-lg text-sm px-2 py-1 min-w-[100px]"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="all-time">All Time</option>
            </select>
          </div>
          
          {/* Date Range Filters */}
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              className="card-secondary rounded-lg px-2 py-1 text-xs flex-1 min-w-[120px]"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <input
              type="date"
              className="card-secondary rounded-lg px-2 py-1 text-xs flex-1 min-w-[120px]"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <button
              onClick={fetchData}
              className="button text-white px-3 py-1 rounded-lg transition text-xs"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="h-64 p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="label" 
              stroke="#6b7280" 
              tick={!isCustomRange} 
              interval={data.length > 10 ? Math.floor(data.length / 8) : 0}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="revenue"
              fill="url(#grayGradient)"
              radius={[10, 10, 0, 0]}
              animationDuration={1200}
            />
            <defs>
              <linearGradient id="grayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.9} />
                <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

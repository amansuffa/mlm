"use client";
import { WorldMap } from "react-svg-worldmap";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function SalesOverview() {
  const [data, setData] = useState([]);
  const [topMarkets, setTopMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await fetch("/api/dashboard/sales-overview");
      const result = await response.json();
      
      if (response.ok) {
        setData(result.mapData);
        setTopMarkets(result.topMarkets);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-600 p-4">
        <h3 className="text-lg font-bold text-white">🌍 Sales Overview</h3>
        <p className="text-sm text-purple-100">Global performance insights</p>
      </div>

      {/* Map */}
      <div className="p-6 flex justify-center">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <WorldMap
            color="gray"
            size="responsive"
            valuePrefix="$"
            data={data}
          />
        )}
      </div>

      {/* Stats / Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 border-t">
        {topMarkets.map((mkt, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm"
          >
            <span
              className={`w-3 h-3 rounded-full ${colors[idx] || "bg-gray-500"}`}
              aria-hidden="true"
            ></span>
            <div>
              <p className="text-sm font-semibold text-gray-700">{mkt.name}</p>
              <p className="text-xs text-gray-500">{mkt.value} ({mkt.salesCount} Sales)</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

"use client";
import { WorldMap } from "react-svg-worldmap";
import { motion } from "framer-motion";

export default function SalesOverview() {
  const data = [
    { country: "us", value: 100000 },
    { country: "in", value: 80000 },
    { country: "br", value: 50000 },
    { country: "cn", value: 120000 },
    { country: "ca", value: 40000 },
  ];

  const topMarkets = [
    { name: "China", value: "120k", color: "bg-red-500" },
    { name: "USA", value: "100k", color: "bg-blue-500" },
    { name: "India", value: "80k", color: "bg-green-500" },
  ];

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
        <WorldMap
          color="gray"
          size="responsive"
          value-suffix="k"
          data={data}
        />
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
              className={`w-3 h-3 rounded-full ${mkt.color}`}
              aria-hidden="true"
            ></span>
            <div>
              <p className="text-sm font-semibold text-gray-700">{mkt.name}</p>
              <p className="text-xs text-gray-500">{mkt.value} Sales</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

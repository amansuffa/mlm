"use client";

import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";

export default function DownlineTree() {
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchReferralTree() {
    try {
      setLoading(true);
      const response = await fetch("/api/referrals/tree");
      const data = await response.json();
      
      if (response.ok) {
        console.log("Received tree data:", data);
        if (!data.treeData || data.treeData.length === 0) {
          setError("No downline data available");
          setTreeData([]);
        } else {
          setTreeData(data.treeData);
          setError(null);
        }
      } else {
        setError(data.error || "Failed to fetch referral tree");
        setTreeData([]);
      }
    } catch (error) {
      setError("Error fetching referral tree. Please try again later.");
      console.error("Error fetching referral tree:", error);
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReferralTree();
  }, []);

  useEffect(() => {
    function setSize() {
      if (treeContainer.current) {
        const { width } = treeContainer.current.getBoundingClientRect();
        setDimensions({ x: width / 2, y: 80 });
      }
    }
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  }, []);

  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g onClick={toggleNode} style={{ cursor: "pointer" }}>
      {/* Node Circle */}
      <circle
        r={16}
        fill={
          nodeDatum.referral_type === "blue"
            ? "url(#blueGradient)"
            : nodeDatum.referral_type === "green"
            ? "url(#greenGradient)"
            : "url(#redGradient)"
        }
        stroke="#fff"
        strokeWidth="3"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))"
      />
      {/* Node Label */}
      <text
        fill="#111827"
        x="24"
        dy=".35em"
        fontSize="13"
        fontWeight="600"
        style={{ pointerEvents: "none" }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );

  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-700">🌳 Downline Tree</h3>
        <button 
          onClick={fetchReferralTree}
          className="text-blue-600 hover:text-blue-800"
        >
          ↻ Refresh
        </button>
      </div>

      <div ref={treeContainer} className="flex-1 w-full" style={{ minHeight: "400px" }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading downline tree...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : dimensions.x !== 0 && treeData.length > 0 ? (
          <Tree
            data={treeData}
            orientation="vertical"
            renderCustomNodeElement={renderCustomNode}
            translate={dimensions}
            zoom={0.8}
            initialDepth={1}
            zoomable
            collapsible
            separation={{ siblings: 2, nonSiblings: 2.5 }}
            nodeSize={{ x: 200, y: 100 }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">No downline data available</div>
          </div>
        )}
      </div>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#3B82F6" offset="0%" />
            <stop stopColor="#1E3A8A" offset="100%" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#10B981" offset="0%" />
            <stop stopColor="#065F46" offset="100%" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#EF4444" offset="0%" />
            <stop stopColor="#7F1D1D" offset="100%" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

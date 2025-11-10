"use client";

import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { useRouter } from "next/navigation";

export default function DownlineTree() {
  const router = useRouter();
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTreeData();
  }, []);

  const fetchTreeData = async () => {
    try {
      const response = await fetch("/api/dashboard/downline-tree");
      const result = await response.json();
      
      console.log("Tree data:", result);
      
      if (response.ok) {
        setTreeData(result);
      }
    } catch (error) {
      console.error("Error fetching tree data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNodeColor = (nodeDatum) => {
    console.log("Node data:", nodeDatum);
    
    // Use referral_type from API if available
    if (nodeDatum.referral_type === "blue") {
      return "url(#blueGradient)";
    } else if (nodeDatum.referral_type === "green") {
      return "url(#greenGradient)";
    } else if (nodeDatum.referral_type === "red") {
      return "url(#redGradient)";
    }
    
    // Fallback logic
    if (nodeDatum.name === "You" || nodeDatum.isRoot) {
      return "url(#blueGradient)";
    }
    
    return "url(#greenGradient)";
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g onClick={toggleNode} style={{ cursor: "pointer" }}>
      {/* Node Circle */}
      <circle
        r={16}
        fill={getNodeColor(nodeDatum)}
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-700">🌳 Downline Tree</h3>
        <button
          onClick={() => router.push('/user/downline')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Show More
        </button>
      </div>
      <div ref={treeContainer} className="flex-1 w-full">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : treeData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No downline data available</div>
        ) : dimensions.x !== 0 ? (
          <Tree
            data={treeData}
            orientation="vertical"
            renderCustomNodeElement={renderCustomNode}
            translate={dimensions}
            zoom={0.8}
            zoomable
            collapsible
          />
        ) : null}
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

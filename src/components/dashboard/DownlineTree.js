"use client";

import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";

export default function DownlineTree() {
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });

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

  const treeData = [
    {
      name: "You (Admin)",
      referral_type: "blue",
      children: [
        {
          name: "John Doe",
          referral_type: "green",
          children: [
            { name: "Ali Raza", referral_type: "red" },
            { name: "Sarah Khan", referral_type: "red" }
          ]
        },
        { name: "Ahmed Malik", referral_type: "green" }
      ]
    }
  ];

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
      <h3 className="text-lg font-bold text-gray-700 mb-4">🌳 Downline Tree</h3>
      <div ref={treeContainer} className="flex-1 w-full">
        {dimensions.x !== 0 && (
          <Tree
            data={treeData}
            orientation="vertical"
            renderCustomNodeElement={renderCustomNode}
            translate={dimensions}
            zoom={0.8}
            zoomable
            collapsible
          />
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

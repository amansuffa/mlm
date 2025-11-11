"use client";

import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";

export default function DownlinePage() {
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ x: 0, y: 0 });
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [flatData, setFlatData] = useState([]);
  const [tableData, setTableData] = useState({
    qualifyingSales: [],
    directSales: [],
    passUpSales: []
  });

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
    fetchTableData();
  }, []);

  useEffect(() => {
    if (viewMode === "tree" && treeContainer.current) {
      const { width } = treeContainer.current.getBoundingClientRect();
      setDimensions({ x: width / 2, y: 80 });
    }
  }, [viewMode]);

  const fetchTreeData = async () => {
    try {
      const response = await fetch("/api/dashboard/downline-tree");
      const result = await response.json();
      
      console.log("API Response:", result);
      
      if (response.ok && result) {
        // Handle both array and object responses
        const treeArray = Array.isArray(result) ? result : [result];
        setTreeData(treeArray);
        const flatResult = flattenTree(Array.isArray(result) ? result[0] : result, 0);
        console.log("Flat Data:", flatResult);
        setFlatData(flatResult);
      } else {
        console.error("API Error:", result);
        // Set fallback data for testing
        const fallbackData = {
          name: "You",
          username: "current_user",
          referral_type: "blue",
          children: []
        };
        setTreeData([fallbackData]);
        setFlatData([{
          name: "You",
          username: "current_user",
          level: 0,
          type: "blue",
          typeLabel: "Root User"
        }]);
      }
    } catch (error) {
      console.error("Error fetching tree data:", error);
      // Set fallback data on error
      const fallbackData = {
        name: "You",
        username: "current_user",
        referral_type: "blue",
        children: []
      };
      setTreeData([fallbackData]);
      const testFlatData = [
        {
          name: "You",
          username: "current_user",
          level: 0,
          type: "blue",
          typeLabel: "Root User"
        },
        {
          name: "John Doe",
          username: "john_doe",
          level: 1,
          type: "green",
          typeLabel: "Direct Sale"
        },
        {
          name: "Sarah Khan",
          username: "sarah_khan",
          level: 2,
          type: "red",
          typeLabel: "Passup Sale"
        }
      ];
      setFlatData(testFlatData);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await fetch("/api/dashboard/downline-tables");
      const result = await response.json();
      
      if (response.ok) {
        setTableData(result);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const flattenTree = (node, level) => {
    const result = [];
    if (node) {
      result.push({
        name: node.name,
        username: node.username,
        level: level,
        type: node.referral_type,
        typeLabel: node.referral_type === "green" ? "Direct Sale" : 
                  node.referral_type === "red" ? "Passup Sale" : "Other Referral"
      });
      
      if (node.children) {
        node.children.forEach(child => {
          result.push(...flattenTree(child, level + 1));
        });
      }
    }
    return result;
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g onClick={toggleNode} style={{ cursor: "pointer" }}>
      {/* Node Circle */}
      <circle
        r={16}
        fill={
          nodeDatum.referral_type === "purple"
            ? "url(#purpleGradient)"
            : nodeDatum.referral_type === "blue"
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Downline Management
                  </h1>
                  <p className="text-blue-100 text-lg">
                    View and manage your network structure
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      viewMode === "table" ? "bg-white text-[#8200DB] shadow-lg" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    Table View
                  </button>
                  <button
                    onClick={() => setViewMode("tree")}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      viewMode === "tree" ? "bg-white text-[#8200DB] shadow-lg" : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    Tree View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
        
            {viewMode === "tree" ? (
              <div ref={treeContainer} className="w-full h-96">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8200DB] mx-auto"></div>
                      <p className="text-gray-600 mt-4 text-lg">Loading tree...</p>
                    </div>
                  </div>
                ) : !treeData || treeData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No downline data available</h3>
                      <p className="text-gray-600">Your network tree will appear here once you have referrals</p>
                    </div>
                  </div>
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
            ) : (
              <div className="space-y-8">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8200DB] mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-lg">Loading data...</p>
                  </div>
                ) : (
                  <>
                    {/* Table 1: Qualifying Sales (Blue) */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">1st Sale (Qualifying Sale - Passed Up)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                          <thead>
                            <tr className="bg-blue-50">
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Sr</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Name</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Username</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Email</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Original Sponsor</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Sale Type</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Passed-Up To</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Status</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-blue-800">Joined At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.qualifyingSales.length === 0 ? (
                              <tr><td colSpan="9" className="text-center p-8 text-gray-500">No qualifying sales</td></tr>
                            ) : (
                              tableData.qualifyingSales.map((sale, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition-colors">
                                  <td className="border border-gray-200 p-3">{sale.sr}</td>
                                  <td className="border border-gray-200 p-3">{sale.name}</td>
                                  <td className="border border-gray-200 p-3">{sale.username}</td>
                                  <td className="border border-gray-200 p-3">{sale.email}</td>
                                  <td className="border border-gray-200 p-3">{sale.originalSponsor}</td>
                                  <td className="border border-gray-200 p-3">{sale.saleType}</td>
                                  <td className="border border-gray-200 p-3">{sale.passedUpTo}</td>
                                  <td className="border border-gray-200 p-3">{sale.status}</td>
                                  <td className="border border-gray-200 p-3">{new Date(sale.joinedAt).toLocaleDateString()}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Table 2: Direct Sales (Green) */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">Direct Referrals (2nd Sale Onwards)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                          <thead>
                            <tr className="bg-green-50">
                              <th className="border border-gray-200 p-3 text-left font-semibold text-green-800">Sr</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-green-800">Name</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-green-800">Username</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-green-800">Email</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-green-800">Sponsor Name</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-green-800">Sale Type</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-green-800">Status</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-green-800">Joined At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.directSales.length === 0 ? (
                              <tr><td colSpan="8" className="text-center p-8 text-gray-500">No direct sales</td></tr>
                            ) : (
                              tableData.directSales.map((sale, index) => (
                                <tr key={index} className="hover:bg-green-50 transition-colors">
                                  <td className="border border-gray-200 p-3">{sale.sr}</td>
                                  <td className="border border-gray-200 p-3">{sale.name}</td>
                                  <td className="border border-gray-200 p-3">{sale.username}</td>
                                  <td className="border border-gray-200 p-3">{sale.email}</td>
                                  <td className="border border-gray-200 p-3">{sale.sponsorName}</td>
                                  <td className="border border-gray-200 p-3">{sale.saleType}</td>
                                  <td className="border border-gray-200 p-3">{sale.status}</td>
                                  <td className="border border-gray-200 p-3">{new Date(sale.joinedAt).toLocaleDateString()}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Table 3: Pass-up Sales (Red) */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">Passed-up Referrals (From Direct Referrals)</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                          <thead>
                            <tr className="bg-red-50">
                              <th className="border border-gray-200 p-3 text-left font-semibold text-red-800">Sr</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-red-800">Name</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-red-800">Username</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-red-800">Email</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-red-800">Original Sponsor</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-red-800">Sale Type</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-red-800">Status</th>
                              <th className="border border-gray-200 p-3 text-left font-semibold text-red-800">Joined At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.passUpSales.length === 0 ? (
                              <tr><td colSpan="8" className="text-center p-8 text-gray-500">No pass-up sales</td></tr>
                            ) : (
                              tableData.passUpSales.map((sale, index) => (
                                <tr key={index} className="hover:bg-red-50 transition-colors">
                                  <td className="border border-gray-200 p-3">{sale.sr}</td>
                                  <td className="border border-gray-200 p-3">{sale.name}</td>
                                  <td className="border border-gray-200 p-3">{sale.username}</td>
                                  <td className="border border-gray-200 p-3">{sale.email}</td>
                                  <td className="border border-gray-200 p-3">{sale.originalSponsor}</td>
                                  <td className="border border-gray-200 p-3">{sale.saleType}</td>
                                  <td className="border border-gray-200 p-3">{sale.status}</td>
                                  <td className="border border-gray-200 p-3">{new Date(sale.joinedAt).toLocaleDateString()}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

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
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#8B5CF6" offset="0%" />
                <stop stopColor="#5B21B6" offset="100%" />
              </linearGradient>
            </defs>
          </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

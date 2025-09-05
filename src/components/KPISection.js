"use client";
import React from "react";
import { Users, UserPlus, DollarSign, Award } from "lucide-react";

export default function KPISection() {
  const kpis = {
    directReferrals: 8,
    indirectReferrals: 24,
    totalDownline: 32,
    totalEarnings: "$1,250",
    currentRank: "Silver",
  };

  const cards = [
    { label: "Direct Referrals", value: kpis.directReferrals, icon: <UserPlus />, color: "from-blue-500 to-blue-600" },
    { label: "Indirect Referrals", value: kpis.indirectReferrals, icon: <Users />, color: "from-green-500 to-green-600" },
    { label: "Total Downline", value: kpis.totalDownline, icon: <Users />, color: "from-purple-500 to-purple-600" },
    { label: "Total Earnings", value: kpis.totalEarnings, icon: <DollarSign />, color: "from-orange-500 to-orange-600", extra: `Rank: ${kpis.currentRank}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`p-5 rounded-xl text-white shadow-md bg-gradient-to-r ${c.color} flex items-center gap-4 transform transition hover:scale-[1.02]`}
        >
          <div className="p-3 bg-white/20 rounded-lg">{c.icon}</div>
          <div>
            <p className="text-sm font-medium">{c.label}</p>
            <p className="text-2xl font-bold">{c.value}</p>
            {c.extra && <p className="text-xs opacity-80">{c.extra}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

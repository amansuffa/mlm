"use client";
import { DollarSign, Users, UserPlus, Award } from "lucide-react";

export default function MemberKPIs() {
  const kpis = {
    totalEarnings: "$950",
    directReferrals: 5,
    indirectReferrals: 15,
    teamSize: 20,
    rank: "Bronze"
  };

  const cards = [
    { label: "Total Earnings", value: kpis.totalEarnings, icon: <DollarSign />, color: "from-orange-500 to-orange-600" },
    { label: "Direct Referrals", value: kpis.directReferrals, icon: <UserPlus />, color: "from-blue-500 to-blue-600" },
    { label: "Indirect Referrals", value: kpis.indirectReferrals, icon: <Users />, color: "from-green-500 to-green-600" },
    { label: "Team Size", value: kpis.teamSize, icon: <Users />, color: "from-purple-500 to-purple-600", extra: `Rank: ${kpis.rank}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`p-5 rounded-xl text-white shadow-md bg-gradient-to-r ${c.color} flex items-center gap-4`}
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

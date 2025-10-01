"use client";

import { useState } from "react";
import MemberKPIs from "@/components/member/MemberKPIs";
import EarningsChart from "@/components/member/EarningsChart";
import ReferralsOverview from "@/components/member/ReferralsOverview";
import PayoutSettingsCard from "@/components/member/PayoutSettingsCard";
import ConfirmPayments from "@/components/member/ConfirmPayments";
import DownlineTree from "@/components/dashboard/DownlineTree"; 
import TransactionsTable from "@/components/dashboard/TransactionsTable"; 

export default function DashboardMember({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="py-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Welcome */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-700">
        Welcome back, {session?.user?.name || "Member"} 👋
      </h1>

      {/* KPIs: Earnings, Referrals, Team, Rank */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <MemberKPIs />
      </div>

      {/* Left/Main Section */}
      <div className="space-y-6 sm:col-span-2 lg:col-span-2">
        <EarningsChart />
        <ReferralsOverview />
      </div>

      {/* Right Sidebar Widgets */}
      <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
        <PayoutSettingsCard />
        <ConfirmPayments />
        <div className="flex-1">
          <DownlineTree />
        </div>
      </div>

      {/* Full Width Section */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <TransactionsTable />
      </div>
    </main>
  );
}

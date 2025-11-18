"use client";

import { useState } from "react";
import KPISection from "@/components/dashboard/KPISection";
import SalesOverview from "@/components/dashboard/SalesOverview";
import VisitorsChart from "@/components/dashboard/EarningsChart";
import TopReferrers from "@/components/dashboard/TopReferrers";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import DownlineTree from "@/components/dashboard/DownlineTree";
import AdminEarning from "@/components/dashboard/AdminEarningsChart";

export default function DashboardAdmin({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="py-6 w-full">
      {/* Welcome */}
      <h1
        className="text-3xl md:text-4xl font-extrabold mb-6"
        style={{ color: "var(--text)" }}
      >
        Welcome, {session?.user?.name || "Admin"} 👋
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* KPIs: Earnings, Referrals, Team, Rank */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <KPISection />
        </div>

        {/* Left/Main Section */}
        <div className="space-y-6 sm:col-span-2 lg:col-span-2">
          <SalesOverview />
        </div>

        {/* Right Sidebar Widgets */}
        <div className="flex flex-col space-y-6 sm:col-span-2 lg:col-span-1 h-full">
          <div className="flex-1">
            <AdminEarning />
          </div>
          <div className="flex-1">
            <TopReferrers />
          </div>
        </div>

        {/* Full Width Section */}
        <div className="col-span-1 space-y-6 sm:col-span-2 lg:col-span-3">
          <VisitorsChart />
          <TransactionsTable />
        </div>
      </div>
    </main>
  );
}

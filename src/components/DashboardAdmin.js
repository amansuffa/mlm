"use client";

import { useState } from "react";
import KPISection from "@/components/dashboard/KPISection";
import SalesOverview from "@/components/dashboard/SalesOverview";
import VisitorsChart from "@/components/dashboard/EarningsChart";
import TopReferrers from "@/components/dashboard/TopReferrers";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import DownlineTree from "@/components/dashboard/DownlineTree";
import WeeklyRevenue from "@/components/dashboard/AdminEarningsChart";

export default function DashboardAdmin({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (

  <main className="py-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--text)' }}>
              Welcome, {session?.user?.name || "User"} 👋
            </h1>
      {/* KPIs always on top - full width */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <KPISection />
      </div>

      {/* Left/Main Section */}
      <div className="space-y-6 sm:col-span-2 lg:col-span-2">
        <SalesOverview />
        <VisitorsChart />
      </div>

      {/* Right Sidebar Widgets */}
      <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
        <WeeklyRevenue />
        <TopReferrers />
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

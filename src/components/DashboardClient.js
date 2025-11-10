"use client";

import { useState } from "react";
import KPISection from "@/components/dashboard/KPISection";
import TopReferrers from "@/components/dashboard/TopReferrers";
import EarningsChart from "@/components/dashboard/EarningsChart";
import ReferralsOverview from "@/components/member/ReferralsOverview";
import PayoutSettingsCard from "@/components/member/PayoutSettingsCard";
import DownlineTree from "@/components/dashboard/DownlineTree";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import SalesOverview from "./dashboard/SalesOverview";
import PayToSponser from "./member/PayToSponser";

export default function DashboardMember({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="py-6 w-full">
      {/* Welcome */}
      <h1
        className="text-3xl md:text-4xl font-extrabold mb-6"
        style={{ color: "var(--text)" }}
      >
        Welcome, {session?.user?.name || "Member"} 👋
      </h1>

      {session?.user?.status === "admin_fee_paid" ? (
        <PayToSponser />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* KPIs: Earnings, Referrals, Team, Rank */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <KPISection />
          </div>

          {/* Left/Main Section */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-2">
            <SalesOverview />
            <EarningsChart />
          </div>

          {/* Right Sidebar Widgets */}
          <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
            <PayoutSettingsCard />
            <TopReferrers />
            <div className="flex-1">
              <DownlineTree />
            </div>
          </div>

          {/* Full Width Section */}
          <div className="col-span-1 space-y-6 sm:col-span-2 lg:col-span-3">
            <ReferralsOverview />
            <TransactionsTable />
          </div>
        </div>
      )}
    </main>
  );
}

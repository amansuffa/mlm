"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import KPISection from "@/components/KPISection";
import SalesOverview from "@/components/SalesOverview";
import TopReferrers from "@/components/TopReferrers";
import DownlineTree from "@/components/DownlineTree";
import WeeklyRevenue from "@/components/WeeklyRevenue";
import Layout from "./Layout";

export default function DashboardClient({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (


<Layout>
  <main className="p-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-700">
              Welcome, {session?.user?.name || "User"} 👋
            </h1>
      {/* KPIs always on top - full width */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <KPISection />
      </div>

      {/* Left/Main Section */}
      <div className="space-y-6 sm:col-span-2 lg:col-span-2">
        <SalesOverview />

      </div>

      {/* Right Sidebar Widgets */}
      <div className="flex flex-col gap-6 sm:col-span-2 lg:col-span-1">
        <WeeklyRevenue />
        <TopReferrers />
        <div className="flex-1">
          <DownlineTree />
        </div>
      </div>

    
    </main>
</Layout>
  );
}

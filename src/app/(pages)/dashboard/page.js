"use client";
import { useSession } from "next-auth/react";
import DashboardClient from "@/components/DashboardClient";
import DashboardAdmin from "@/components/DashboardAdmin";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--primary)' }}></div>
          <p className="text-lg opacity-80">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!session?.user) return null;

  console.log("Dashboard Role:", session?.user?.role);
  console.log("Dashboard Status:", session?.user?.status);

  if (session?.user.role === "admin") {
    return <DashboardAdmin session={session} />;
  } else if (session?.user.role === "user") {
    return <DashboardClient session={session} />;
  }

  return null;
}

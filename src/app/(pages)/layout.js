
"use client";
import { useSession } from "next-auth/react";
import Layout from "@/components/layout/Layout";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const role = session?.user?.role || "guest";
  const status = session?.user?.status;

  return (
    <Layout role={role} status={status}>
      {children}
    </Layout>
  );
}

"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardClient from "@/components/DashboardClient";
import DashboardAdmin from "@/components/DashboardAdmin";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;
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

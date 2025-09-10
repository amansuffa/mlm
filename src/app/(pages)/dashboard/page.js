import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import DashboardAdmin from "@/components/DashboardAdmin";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }
  if (session?.user.role === "admin"){

    return <DashboardAdmin session={session} />;
  }else{
    
    return <DashboardClient session={session} />;
  }

}

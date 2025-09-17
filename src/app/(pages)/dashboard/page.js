import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import DashboardAdmin from "@/components/DashboardAdmin";

export default async function DashboardPage() {
  const session = await auth();
let role = session?.user?.role;
console.log("Hello", role);
console.log("Session User:", session?.user);

  if (!session?.user) {
    redirect("/login");
  }
  if (session?.user.role === "admin"){

    return <DashboardAdmin session={session} />;
  }else if (session?.user.role === "user"){
    
    return <DashboardClient session={session} />;
  }

}

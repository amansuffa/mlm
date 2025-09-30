
import { auth } from "@/auth"; 
import Layout from "@/components/layout/Layout";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  const role = session?.user?.role || "guest";
  const status = session?.user?.status; 

  console.log("DashboardLayout Role:", role);

  return (
    <Layout role={role} status={status}>
      {children}
    </Layout>
  );
}

// import Layout from "@/components/layout/Layout";
// import { auth } from "@/auth"; 

// export default async function DashboardLayout({ children }) {
//   const session = await auth(); 
//   const role = session?.user?.role; 
//   console.log("DashboardLayout Role:", role);

//   return (
//     <Layout role={role}>
//         {children}
//         </Layout>
//   );
// }



// src/app/(dashboard)/layout.js
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

// "use client";
// import { useState } from "react";
// import Navbar from "../dashboard/Navbar";
// import Sidebar from "../Sidebar";

// export default function Layout({ children, role }) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar setIsOpen={setIsOpen} />

//       <div className="flex flex-1">
//         <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={role}/>

//         <main className="px-6 w-full bg-gray-100 min-h-screen">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



// src/components/layout/Layout.jsx
"use client";
import { useState } from "react";
import Navbar from "../dashboard/Navbar";
import Sidebar from "../Sidebar";

export default function Layout({ children, role }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setIsOpen={setIsOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={role} />
        <main className="px-6 w-full bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}

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
import { useState, useEffect } from "react";
import Nav from "../dashboard/Nav";
import Sidebar from "../Sidebar";
import { useTheme } from "next-themes";


export default function Layout({ children, role , status}) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  // Prevent main content scroll when sidebar is open on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (isOpen && window.innerWidth < 768) { // md breakpoint
        mainElement.style.overflow = 'hidden';
      } else {
        mainElement.style.overflow = '';
      }
    }

    return () => {
      if (mainElement) {
        mainElement.style.overflow = '';
      }
    };
  }, [isOpen]);
  

  return (
    <div className="min-h-screen flex flex-col">
      <Nav setIsOpen={setIsOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role={role} status={status}/>
        <main style={{backgroundImage: 'var(--background-gradient)'}} className="px-6 w-full bg-[var(--background)] border-t border-[var(--border)] min-h-screen">{children}</main>
      </div>
    </div>
  );
}

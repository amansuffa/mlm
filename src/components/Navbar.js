// "use client";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import Logout from "./Logout";
// import Image from "next/image";

// import logo from "../assets/logo.png";


// export default function Navbar() {
//   const { data: session } = useSession();

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="w-full h-[68px] px-4 py-3 flex justify-between items-center">
//         {/* Left Side - Logo & Links */}
//         <div className="flex items-center gap-6">
//              <div className="flex justify-center overflow-hidden">
//         <Image
//           className="object-cover mb-1"
//           src={logo}
//           alt="Logo"
//           width={180}  
//           height={180}
//         />
//       </div>
//           <Link href="/" className="text-gray-700 hover:text-purple-600">
//             Home
//           </Link>
//           <Link href="/blogs" className="text-gray-700 hover:text-purple-600">
//             Blogs
//           </Link>
//           <Link href="/about" className="text-gray-700 hover:text-purple-600">
//             About
//           </Link>
//           {session?.user && (
//             <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
//               Dashboard
//             </Link>
//           )}
//         </div>

//         {/* Right Side - Login/Signup or Profile */}
//         <div className="flex items-center gap-3">
//           {!session?.user ? (
//             <>
//               <Link href="/login">
//                 <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
//                   Login
//                 </button>
//               </Link>
//               <Link href="/signup">
//                 <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
//                   Signup
//                 </button>
//               </Link>
//             </>
//           ) : (
//             <Logout/>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
// "use client";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import Logout from "./Logout";
// import Image from "next/image";
// import { useTheme } from "@/contexts/ThemeContext";
// import logo from "../assets/logo.png";

// export default function Navbar() {
//   const { data: session } = useSession();
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <nav className="bg-primary text-textPrimary shadow-md transition-colors duration-300">
//       <div className="w-full h-[68px] px-4 py-3 flex justify-between items-center">
//         {/* Left Side - Logo & Links */}
//         <div className="flex items-center gap-6">
//           <div className="flex justify-center overflow-hidden">
//             <Image
//               className="object-cover mb-1 transition-opacity duration-300"
//               src={theme === 'dark' ? (logoDark || logo) : logo}
//               alt="Logo"
//               width={180}  
//               height={180}
//             />
//           </div>
//           <Link href="/" className="text-textPrimary hover:text-accent transition-colors duration-200">
//             Home
//           </Link>
//           <Link href="/blogs" className="text-textPrimary hover:text-accent transition-colors duration-200">
//             Blogs
//           </Link>
//           <Link href="/about" className="text-textPrimary hover:text-accent transition-colors duration-200">
//             About
//           </Link>
//           {session?.user && (
//             <Link href="/dashboard" className="text-textPrimary hover:text-accent transition-colors duration-200">
//               Dashboard
//             </Link>
//           )}
//         </div>

//         {/* Right Side - Theme Switcher + Auth Buttons */}
//         <div className="flex items-center gap-4">
//           {/* Professional Theme Switcher */}
//           <div className="flex items-center gap-2">
//             {/* Sun Icon - Light Theme */}
//             <svg 
//               className={`w-4 h-4 transition-opacity duration-200 ${
//                 theme === 'light' ? 'text-yellow-500 opacity-100' : 'text-gray-400 opacity-50'
//               }`} 
//               fill="currentColor" 
//               viewBox="0 0 20 20"
//             >
//               <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
//             </svg>

//             {/* Toggle Switch */}
//             <button
//               onClick={toggleTheme}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
//                 theme === 'dark' ? 'bg-accent' : 'bg-gray-300'
//               }`}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                   theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
//                 }`}
//               />
//             </button>

//             {/* Moon Icon - Dark Theme */}
//             <svg 
//               className={`w-4 h-4 transition-opacity duration-200 ${
//                 theme === 'dark' ? 'text-blue-400 opacity-100' : 'text-gray-400 opacity-50'
//               }`} 
//               fill="currentColor" 
//               viewBox="0 0 20 20"
//             >
//               <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//             </svg>
//           </div>

//           {/* Auth Buttons */}
//           {!session?.user ? (
//             <>
//               <Link href="/login">
//                 <button className="px-4 py-2 bg-accent text-primary rounded-md hover:opacity-90 transition-opacity duration-200 font-medium">
//                   Login
//                 </button>
//               </Link>
//               <Link href="/signup">
//                 <button className="px-4 py-2 bg-secondary text-textPrimary rounded-md hover:opacity-90 transition-opacity duration-200 font-medium border border-gray-300 dark:border-gray-600">
//                   Signup
//                 </button>
//               </Link>
//             </>
//           ) : (
//             <Logout/>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
// components/Navbar.jsx
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Logout from "./Logout";
import Image from "next/image";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import logo from "../assets/logo.png";
import ThemeToggleButton from "./ThemeToggleButton";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="bg-white shadow-md">
        <div className="w-full h-[68px] px-4 py-3 flex justify-between items-center">
          {/* Loading state */}
          <div className="flex items-center gap-6">
            <Image src={logo} alt="Logo" width={180} height={180} />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="shadow-md transition-colors duration-300">
      <div className="w-full h-[68px] px-4 py-3 flex justify-between items-center">
        {/* Left Side - Logo & Links */}
        <div className="flex items-center gap-6">
          <div className="flex justify-center overflow-hidden">
            <Image
              className="object-cover mb-1"
              src={logo}
              alt="Logo"
              width={180}  
              height={180}
            />
          </div>
          <Link href="/" className="dark:hover:text-yellow-400 transition-colors duration-200 font-medium">
            Home
          </Link>
          <Link href="/blogs" className="dark:hover:text-yellow-400 transition-colors duration-200 font-medium">
            Blogs
          </Link>
          <Link href="/about" className="dark:hover:text-yellow-400 transition-colors duration-200 font-medium">
            About
          </Link>
          {session?.user && (
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-yellow-400 transition-colors duration-200">
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side - Theme Switcher + Auth Buttons */}
        <div className="flex items-center gap-4">
          {/* Professional Theme Switcher */}
          <ThemeToggleButton/>

          {/* Auth Buttons */}
          {!session?.user ? (
            <>
              <Link href="/login">
                <button className="px-4 py-2 dark:bg-yellow-400 dark:text-[#181A20] rounded-md hover:opacity-90 transition-opacity duration-200 font-medium">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 bg-gray-200 dark:bg-[#29313D] text-gray-800 dark:text-gray-200 rounded-md hover:opacity-90 transition-opacity duration-200 font-medium">
                  Signup
                </button>
              </Link>
            </>
          ) : (
            <Logout/>
          )}
        </div>
      </div>
    </nav>
  );
}
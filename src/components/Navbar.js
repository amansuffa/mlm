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
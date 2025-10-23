"use client";
import React from "react";
import Link from "next/link";

import Logout from "../Logout";
import Image from "next/image";
import logo from "../../assets/logo.png";

import { useEffect, useState } from 'react';
import ThemeToggleButton from "../ThemeToggleButton";

const Nav = ({ setIsOpen }) => {
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
    <div className="bg-gray-50 h-[68px] px-6 flex items-center justify-between shadow-md md:sticky top-0 z-50">

      {/* Logo */}
      <div className="flex justify-center overflow-hidden h-full">
        <Image
          className="object-cover mb-1"
          src={logo}
          alt="Logo"
          width={180}  
          height={48}
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <ThemeToggleButton/>
         <Link href="/" className="text-gray-700 hover:text-purple-600">
            Home
          </Link>
        <Logout />

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-700/50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Nav;

"use client";
import React from "react";
import Logout from "./Logout";
import Image from "next/image";
import logo from "../assets/logo.png";

const Navbar = ({ setIsOpen }) => {
  return (
    <div className="bg-gray-50 h-[68px] px-6 flex items-center justify-between shadow-md sticky top-0 z-50">

      {/* Logo */}
      <div className="flex justify-center overflow-hidden h-full">
        <Image
          className="object-cover mb-1"
          src={logo}
          alt="Logo"
          width={180}  
          height={180} 
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <Logout />

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-700/50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
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

export default Navbar;

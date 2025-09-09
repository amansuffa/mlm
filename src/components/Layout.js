// components/Layout.js
"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar setIsOpen={setIsOpen} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main Content */}
        <main className="px-6 w-full bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

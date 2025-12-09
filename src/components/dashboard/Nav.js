"use client";
import React from "react";
import Link from "next/link";
import Logout from "../Logout";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";
import ThemeToggleButton from "../ThemeToggleButton";
import TranslateWidget from "../TranslateWidget";

const Nav = ({ setIsOpen }) => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav
        style={{ backgroundColor: "var(--card)" }}
        className="shadow-md md:sticky top-0 z-50"
      >
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
    <div
      className="h-[68px] px-3 sm:px-6 flex items-center justify-between shadow-md md:sticky top-0 z-50"
      style={{ backgroundColor: "var(--card)" }}
    >
      {/* Logo */}
      <div className="flex justify-center overflow-hidden h-full flex-shrink-0">
        <Image
          className="object-cover mb-1"
          src={logo}
          alt="Logo"
          width={180}
          height={48}
        />
      </div>

      {/* Desktop Right section - visible on md and up */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/"
          style={{ color: "var(--text)" }}
          className="hover:opacity-80"
        >
          Home
        </Link>
        {/* <TranslateWidget /> */}
        <ThemeToggleButton />
        <Logout />
        <Link href="/user/profile">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {session?.user?.profilePicture ? (
              <Image
                src={session.user.profilePicture}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              session?.user?.name?.charAt(0) ||
              session?.user?.email?.charAt(0) ||
              "U"
            )}
          </div>
        </Link>
      </div>

      {/* Mobile Right section - theme toggle and hamburger menu button */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggleButton />
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 rounded-lg hover:opacity-80"
          style={{ backgroundColor: "var(--cardsec)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            style={{ color: "var(--text)" }}
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
